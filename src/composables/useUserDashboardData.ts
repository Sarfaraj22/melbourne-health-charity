import { computed, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  subscribeAppointmentsForUser,
  subscribeEventRegistrationsForUser,
  subscribeMessagesForUser,
  subscribePublishedEvents,
  type WithId,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import { getServiceDetailBySlug } from '@/composables/useServicesContent'
import { mapEventRecordToDetail } from '@/composables/useEventsContent'
import type {
  DashboardAppointment,
  DashboardMessage,
  DashboardUpcomingEvent,
} from '@/types/dashboard'
import type {
  AppointmentDoc,
  EventRecordDoc,
  EventRegistrationDoc,
  InboxMessageDoc,
} from '@/types/firestore'
import {
  formatMillisAsDdMmYyyy,
  parseDateDdMmYyyy,
  parseTimeAmPm,
  startOfToday,
} from '@/utils/datetime'

export interface UseUserDashboardDataReturn {
  readonly loading: Ref<boolean>
  readonly appointments: ComputedRef<readonly DashboardAppointment[]>
  readonly upcomingAppointment: ComputedRef<DashboardAppointment | undefined>
  readonly messages: ComputedRef<readonly DashboardMessage[]>
  readonly eventBookings: ComputedRef<readonly DashboardUpcomingEvent[]>
}

function appointmentSortValue(appointment: DashboardAppointment): number {
  const date = parseDateDdMmYyyy(appointment.date)
  if (date === undefined) {
    return Number.MAX_SAFE_INTEGER
  }
  const time = parseTimeAmPm(appointment.time)
  if (time === undefined) {
    return date.getTime()
  }
  return date.getTime() + time.hours * 60 * 60 * 1000 + time.minutes * 60 * 1000
}

function toDashboardAppointment(record: WithId<AppointmentDoc>): DashboardAppointment {
  const service = getServiceDetailBySlug(record.data.serviceSlug)
  return {
    id: record.id,
    service: service === undefined ? record.data.serviceSlug : service.title,
    date: record.data.date,
    time: record.data.time,
    location: service === undefined ? '123 Example Street, Melbourne VIC 3000' : service.location,
  }
}

function toDashboardMessage(record: WithId<InboxMessageDoc>): DashboardMessage {
  return {
    id: record.id,
    sender: record.data.sender,
    preview: record.data.body,
    body: record.data.body,
    fromRole: record.data.fromRole,
    receivedAt: formatMillisAsDdMmYyyy(record.data.createdAt),
  }
}

export function useUserDashboardData(): UseUserDashboardDataReturn {
  const authStore = useAuthStore()
  const loading = ref(true)
  const appointmentRecords = ref<readonly WithId<AppointmentDoc>[]>([])
  const messageRecords = ref<readonly WithId<InboxMessageDoc>[]>([])
  const registrationRecords = ref<readonly WithId<EventRegistrationDoc>[]>([])
  const publishedEvents = ref<readonly WithId<EventRecordDoc>[]>([])

  const unsubscribers: Array<() => void> = []

  function clearSubscriptions(): void {
    for (const unsubscribe of unsubscribers) {
      unsubscribe()
    }
    unsubscribers.length = 0
  }

  function subscribeForUser(userId: string): void {
    clearSubscriptions()
    loading.value = true

    unsubscribers.push(
      subscribeAppointmentsForUser(userId, (records) => {
        appointmentRecords.value = records
        loading.value = false
      }),
      subscribeMessagesForUser(userId, (records) => {
        messageRecords.value = records
      }),
      subscribeEventRegistrationsForUser(userId, (records) => {
        registrationRecords.value = records
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
        clearSubscriptions()
        appointmentRecords.value = []
        messageRecords.value = []
        registrationRecords.value = []
        publishedEvents.value = []
        loading.value = false
        return
      }
      subscribeForUser(uid)
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    clearSubscriptions()
  })

  const appointments = computed((): readonly DashboardAppointment[] =>
    appointmentRecords.value
      .map(toDashboardAppointment)
      .slice()
      .sort((left, right) => appointmentSortValue(left) - appointmentSortValue(right)),
  )

  const upcomingAppointment = computed((): DashboardAppointment | undefined => {
    const today = startOfToday().getTime()
    return appointments.value.find((appointment) => {
      const parsed = parseDateDdMmYyyy(appointment.date)
      return parsed !== undefined && parsed.getTime() >= today
    })
  })

  const messages = computed((): readonly DashboardMessage[] =>
    messageRecords.value
      .slice()
      .sort((left, right) => right.data.createdAt - left.data.createdAt)
      .map(toDashboardMessage),
  )

  const eventBookings = computed((): readonly DashboardUpcomingEvent[] => {
    const bySlug = new Map(
      publishedEvents.value.map((record) => [
        record.data.slug,
        mapEventRecordToDetail(record.data),
      ]),
    )
    const bookings: DashboardUpcomingEvent[] = []
    for (const registration of registrationRecords.value) {
      const event = bySlug.get(registration.data.eventSlug)
      if (event === undefined) {
        continue
      }
      bookings.push({
        id: registration.id,
        dateBadge: event.dateBadge,
        title: event.title,
        summary: event.summary,
        images: event.images,
        href: `/events/${event.slug}`,
      })
    }
    return bookings
  })

  return {
    loading,
    appointments,
    upcomingAppointment,
    messages,
    eventBookings,
  }
}
