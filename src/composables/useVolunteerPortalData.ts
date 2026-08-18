import { computed, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  subscribeMessagesForUser,
  subscribePublishedEvents,
  subscribeVolunteerByAuthUid,
  subscribeVolunteerHoursForVolunteer,
  type WithId,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import { mapEventRecordToDetail } from '@/composables/useEventsContent'
import type {
  VolunteerEvent,
  VolunteerMessage,
  VolunteerProfile,
  VolunteerStat,
  VolunteerTrainingProgress,
} from '@/types/volunteer'
import type {
  EventRecordDoc,
  InboxMessageDoc,
  VolunteerHoursDoc,
  VolunteerRecordDoc,
} from '@/types/firestore'

export interface UseVolunteerPortalDataReturn {
  readonly loading: Ref<boolean>
  readonly profile: ComputedRef<VolunteerProfile>
  readonly trainingProgress: ComputedRef<VolunteerTrainingProgress>
  readonly stats: ComputedRef<readonly VolunteerStat[]>
  readonly events: ComputedRef<readonly VolunteerEvent[]>
  readonly messages: ComputedRef<readonly VolunteerMessage[]>
}

function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0)
  if (parts.length === 0) {
    return 'V'
  }
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined
  if (first === undefined) {
    return 'V'
  }
  const firstInitial = first.slice(0, 1).toUpperCase()
  if (last === undefined) {
    return firstInitial
  }
  return `${firstInitial}${last.slice(0, 1).toUpperCase()}`
}

export function useVolunteerPortalData(): UseVolunteerPortalDataReturn {
  const authStore = useAuthStore()
  const loading = ref(true)
  const volunteer = ref<WithId<VolunteerRecordDoc> | undefined>(undefined)
  const hourRecords = ref<readonly WithId<VolunteerHoursDoc>[]>([])
  const messageRecords = ref<readonly WithId<InboxMessageDoc>[]>([])
  const publishedEvents = ref<readonly WithId<EventRecordDoc>[]>([])

  const rootUnsubscribers: Array<() => void> = []
  let hoursUnsubscribe: (() => void) | undefined

  function clearHoursSubscription(): void {
    if (hoursUnsubscribe !== undefined) {
      hoursUnsubscribe()
      hoursUnsubscribe = undefined
    }
  }

  function clearRootSubscriptions(): void {
    clearHoursSubscription()
    for (const unsubscribe of rootUnsubscribers) {
      unsubscribe()
    }
    rootUnsubscribers.length = 0
  }

  function subscribeForUser(userId: string): void {
    clearRootSubscriptions()
    loading.value = true

    rootUnsubscribers.push(
      subscribeVolunteerByAuthUid(userId, (record) => {
        volunteer.value = record
        clearHoursSubscription()
        hourRecords.value = []
        if (record === undefined) {
          loading.value = false
          return
        }
        hoursUnsubscribe = subscribeVolunteerHoursForVolunteer(record.id, (hours) => {
          hourRecords.value = hours
          loading.value = false
        })
      }),
      subscribeMessagesForUser(userId, (records) => {
        messageRecords.value = records
      }),
      subscribePublishedEvents((records) => {
        publishedEvents.value = records
      }),
    )
  }

  watch(
    () => authStore.user?.uid,
    (uid) => {
      if (uid === undefined) {
        clearRootSubscriptions()
        volunteer.value = undefined
        hourRecords.value = []
        messageRecords.value = []
        publishedEvents.value = []
        loading.value = false
        return
      }
      subscribeForUser(uid)
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    clearRootSubscriptions()
  })

  const profile = computed((): VolunteerProfile => {
    const displayName = authStore.user?.displayName
    const name =
      displayName !== undefined && displayName.length > 0
        ? displayName
        : (volunteer.value?.data.name ?? 'Volunteer')
    return {
      name,
      role: 'Volunteer',
      initials: initialsFromName(name),
    }
  })

  const trainingProgress = computed((): VolunteerTrainingProgress => ({
    percent: volunteer.value === undefined ? 0 : volunteer.value.data.trainingPercent,
  }))

  const stats = computed((): readonly VolunteerStat[] => {
    const loggedHours = hourRecords.value.reduce((sum, record) => sum + record.data.hours, 0)
    const hours = loggedHours > 0 ? loggedHours : (volunteer.value?.data.hours ?? 0)
    return [
      {
        id: 'volunteer-hours',
        label: 'VOLUNTEER HOURS',
        value: String(hours),
        caption: 'hours logged',
      },
      {
        id: 'training',
        label: 'TRAINING',
        value: `${trainingProgress.value.percent}%`,
        caption: 'complete',
      },
    ]
  })

  const events = computed((): readonly VolunteerEvent[] =>
    publishedEvents.value
      .map((record) => mapEventRecordToDetail(record.data))
      .filter((event) => event.status !== 'past')
      .slice(0, 3)
      .map((event) => ({
        id: event.slug,
        dateBadge: event.dateBadge,
        title: event.title,
        description: event.summary,
        image: event.images.image,
        imageJpg: event.images.imageJpg,
        imageSmall: event.images.imageSmall,
        imageSmallJpg: event.images.imageSmallJpg,
        imageAlt: event.images.imageAlt,
      })),
  )

  const messages = computed((): readonly VolunteerMessage[] =>
    messageRecords.value
      .slice()
      .sort((left, right) => right.data.createdAt - left.data.createdAt)
      .map((record) => ({
        id: record.id,
        sender: record.data.sender,
        preview: record.data.body,
        body: record.data.body,
        fromRole: record.data.fromRole,
      })),
  )

  return {
    loading,
    profile,
    trainingProgress,
    stats,
    events,
    messages,
  }
}
