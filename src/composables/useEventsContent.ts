import { computed, onUnmounted, ref, type Ref } from 'vue'
import type { EventDetail, EventStatus, EventsContent } from '@/types/event'
import type { ServiceImageSet } from '@/types/service'
import type { EventRecordDoc } from '@/types/firestore'
import { subscribePublishedEvents, type WithId } from '@/services/firebase/firestore.service'
import { daysFromToday, formatDateBadge, parseDateDdMmYyyy } from '@/utils/datetime'

import eventMorningTeaWebp from '@/assets/images/event-morning-tea.webp'
import eventMorningTeaJpg from '@/assets/images/event-morning-tea.jpg'
import eventMorningTeaSmallWebp from '@/assets/images/event-morning-tea-400.webp'
import eventMorningTeaSmallJpg from '@/assets/images/event-morning-tea-400.jpg'
import eventNdisSessionWebp from '@/assets/images/event-ndis-session.webp'
import eventNdisSessionJpg from '@/assets/images/event-ndis-session.jpg'
import eventNdisSessionSmallWebp from '@/assets/images/event-ndis-session-400.webp'
import eventNdisSessionSmallJpg from '@/assets/images/event-ndis-session-400.jpg'
import eventSportsDayWebp from '@/assets/images/event-sports-day.webp'
import eventSportsDayJpg from '@/assets/images/event-sports-day.jpg'
import eventSportsDaySmallWebp from '@/assets/images/event-sports-day-400.webp'
import eventSportsDaySmallJpg from '@/assets/images/event-sports-day-400.jpg'
import eventWellbeingRetreatWebp from '@/assets/images/event-wellbeing-retreat.webp'
import eventWellbeingRetreatJpg from '@/assets/images/event-wellbeing-retreat.jpg'
import eventWellbeingRetreatSmallWebp from '@/assets/images/event-wellbeing-retreat-400.webp'
import eventWellbeingRetreatSmallJpg from '@/assets/images/event-wellbeing-retreat-400.jpg'
import eventArtsWorkshopWebp from '@/assets/images/event-arts-workshop.webp'
import eventArtsWorkshopJpg from '@/assets/images/event-arts-workshop.jpg'
import eventArtsWorkshopSmallWebp from '@/assets/images/event-arts-workshop-400.webp'
import eventArtsWorkshopSmallJpg from '@/assets/images/event-arts-workshop-400.jpg'
import eventCommunityFunRunWebp from '@/assets/images/event-community-fun-run.webp'
import eventCommunityFunRunJpg from '@/assets/images/event-community-fun-run.jpg'
import eventCommunityFunRunSmallWebp from '@/assets/images/event-community-fun-run-400.webp'
import eventCommunityFunRunSmallJpg from '@/assets/images/event-community-fun-run-400.jpg'

export interface EventMediaExtras {
  readonly images: ServiceImageSet
  readonly cost: string
}

const DEFAULT_EVENT_MEDIA: EventMediaExtras = {
  cost: 'Free',
  images: {
    image: eventCommunityFunRunWebp,
    imageJpg: eventCommunityFunRunJpg,
    imageSmall: eventCommunityFunRunSmallWebp,
    imageSmallJpg: eventCommunityFunRunSmallJpg,
    imageAlt: 'Community members taking part in a Melbourne Health Charity event',
  },
}

const EVENT_MEDIA_BY_SLUG: Readonly<Record<string, EventMediaExtras>> = {
  'community-morning-tea': {
    cost: 'Free — light refreshments provided',
    images: {
      image: eventMorningTeaWebp,
      imageJpg: eventMorningTeaJpg,
      imageSmall: eventMorningTeaSmallWebp,
      imageSmallJpg: eventMorningTeaSmallJpg,
      imageAlt: 'People gathered together chatting at a community morning tea',
    },
  },
  'ndis-info-session': {
    cost: 'Free',
    images: {
      image: eventNdisSessionWebp,
      imageJpg: eventNdisSessionJpg,
      imageSmall: eventNdisSessionSmallWebp,
      imageSmallJpg: eventNdisSessionSmallJpg,
      imageAlt: 'A healthcare professional consulting with a patient during an information session',
    },
  },
  'accessible-sports-day': {
    cost: 'Free — sausage sizzle included',
    images: {
      image: eventSportsDayWebp,
      imageJpg: eventSportsDayJpg,
      imageSmall: eventSportsDaySmallWebp,
      imageSmallJpg: eventSportsDaySmallJpg,
      imageAlt: 'Wheelchair basketball players competing on an outdoor court',
    },
  },
  'carers-wellbeing-retreat': {
    cost: 'Free for registered carers — lunch provided',
    images: {
      image: eventWellbeingRetreatWebp,
      imageJpg: eventWellbeingRetreatJpg,
      imageSmall: eventWellbeingRetreatSmallWebp,
      imageSmallJpg: eventWellbeingRetreatSmallJpg,
      imageAlt: 'A tranquil outdoor wellness retreat surrounded by nature',
    },
  },
  'accessible-arts-workshop': {
    cost: 'Free — all materials provided',
    images: {
      image: eventArtsWorkshopWebp,
      imageJpg: eventArtsWorkshopJpg,
      imageSmall: eventArtsWorkshopSmallWebp,
      imageSmallJpg: eventArtsWorkshopSmallJpg,
      imageAlt: 'People painting together at a table in an inclusive art workshop',
    },
  },
  'community-fun-run': {
    cost: 'Free to register — donations welcome',
    images: {
      image: eventCommunityFunRunWebp,
      imageJpg: eventCommunityFunRunJpg,
      imageSmall: eventCommunityFunRunSmallWebp,
      imageSmallJpg: eventCommunityFunRunSmallJpg,
      imageAlt: 'Runners celebrating as they finish a community fun run',
    },
  },
}

const CURRENT_EVENT_WINDOW_DAYS = 21

export interface UseEventsContentReturn extends EventsContent {
  readonly loading: Ref<boolean>
  readonly error: Ref<string>
  getEventBySlug: (slug: string) => EventDetail | undefined
}

function mediaForSlug(slug: string): EventMediaExtras {
  const mapped = EVENT_MEDIA_BY_SLUG[slug]
  return mapped === undefined ? DEFAULT_EVENT_MEDIA : mapped
}

function statusFromDate(date: Date): EventStatus {
  const diff = daysFromToday(date)
  if (diff < 0) {
    return 'past'
  }
  if (diff <= CURRENT_EVENT_WINDOW_DAYS) {
    return 'current'
  }
  return 'future'
}

export function mapEventRecordToDetail(record: EventRecordDoc): EventDetail {
  const media = mediaForSlug(record.slug)
  const parsedDate = parseDateDdMmYyyy(record.date)
  const status: EventStatus = parsedDate === undefined ? 'future' : statusFromDate(parsedDate)
  const registrationOpen = record.status === 'published' && status !== 'past'

  return {
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    description: record.description,
    date: record.date,
    dateBadge: formatDateBadge(record.date),
    time: record.time,
    location: record.location,
    cost: media.cost,
    status,
    images: media.images,
    registrationOpen,
  }
}

function sortByDate(left: EventDetail, right: EventDetail): number {
  const leftDate = parseDateDdMmYyyy(left.date)
  const rightDate = parseDateDdMmYyyy(right.date)
  const leftTime = leftDate === undefined ? Number.MAX_SAFE_INTEGER : leftDate.getTime()
  const rightTime = rightDate === undefined ? Number.MAX_SAFE_INTEGER : rightDate.getTime()
  return leftTime - rightTime
}

export function useEventsContent(): UseEventsContentReturn {
  const records = ref<readonly WithId<EventRecordDoc>[]>([])
  const loading = ref(true)
  const error = ref('')

  const unsubscribe = subscribePublishedEvents(
    (next) => {
      records.value = next
      loading.value = false
      error.value = ''
    },
    (subscribeError) => {
      loading.value = false
      error.value = subscribeError.message
    },
  )

  onUnmounted(() => {
    unsubscribe()
  })

  const events = computed((): readonly EventDetail[] =>
    records.value
      .map((record) => mapEventRecordToDetail(record.data))
      .slice()
      .sort(sortByDate),
  )

  const currentEvents = computed((): readonly EventDetail[] =>
    events.value.filter((event) => event.status === 'current'),
  )

  const futureEvents = computed((): readonly EventDetail[] =>
    events.value.filter((event) => event.status === 'future'),
  )

  function getEventBySlug(slug: string): EventDetail | undefined {
    return events.value.find((event) => event.slug === slug)
  }

  return {
    events,
    currentEvents,
    futureEvents,
    loading,
    error,
    getEventBySlug,
  }
}
