import { computed, onMounted, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import {
  countContactMessages,
  getRecentContactMessages,
  subscribeEvents,
  subscribeInboxMessages,
  subscribeLiveChats,
  subscribeProfiles,
  subscribeReports,
  subscribeVolunteerApplications,
  subscribeVolunteerHours,
  subscribeVolunteers,
  type WithId,
} from '@/services/firebase/firestore.service'
import type {
  AdminChartBar,
  AdminComplianceFeature,
  AdminDashboardData,
  AdminEvent,
  AdminInboxThread,
  AdminKpiCard,
  AdminLiveChatThread,
  AdminMessage,
  AdminProfile,
  AdminReportMetric,
  AdminVolunteer,
  AdminVolunteerApplication,
} from '@/types/admin'
import type {
  EventRecordDoc,
  InboxMessageDoc,
  LiveChatDoc,
  ProfileDoc,
  ReportDoc,
  VolunteerApplicationDoc,
  VolunteerHoursDoc,
  VolunteerRecordDoc,
} from '@/types/firestore'
import type { ContactMessageDoc } from '@/types/firestore'

export interface UseAdminDashboardDataReturn {
  readonly loading: Ref<boolean>
  readonly error: Ref<string>
  readonly data: ComputedRef<AdminDashboardData>
  readonly greetingSubtitle: string
}

const greetingSubtitle = "Here's what's happening across the organisation today."

const complianceFeatures: readonly AdminComplianceFeature[] = [
  {
    id: 'role-based-access',
    icon: 'users',
    title: 'Role-Based Access',
    description: 'Staff and volunteers only see the data relevant to their role.',
  },
  {
    id: 'encrypted-storage',
    icon: 'lock',
    title: 'Encrypted Storage',
    description: 'All records are encrypted at rest and in transit.',
  },
  {
    id: 'audit-trail-logging',
    icon: 'clipboard-list',
    title: 'Audit Trail Logging',
    description: 'Every change to sensitive records is tracked and reviewable.',
  },
  {
    id: 'ndis-data-compliance',
    icon: 'shield-check',
    title: 'NDIS Data Compliance',
    description: 'Meets NDIS and Australian Privacy Principles requirements.',
  },
]

const monthLabels: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function lastSevenMonths(): readonly { readonly key: string; readonly label: string }[] {
  const now = new Date()
  const months: { key: string; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), label: monthLabels[d.getMonth()] ?? '' })
  }
  return months
}

function isCurrentQuarter(createdAt: number): boolean {
  const now = new Date()
  const date = new Date(createdAt)
  const currentQuarter = Math.floor(now.getMonth() / 3)
  const dateQuarter = Math.floor(date.getMonth() / 3)
  return date.getFullYear() === now.getFullYear() && dateQuarter === currentQuarter
}

function isCurrentYear(createdAt: number): boolean {
  return new Date(createdAt).getFullYear() === new Date().getFullYear()
}

function mapVolunteer(record: WithId<VolunteerRecordDoc>): AdminVolunteer {
  return {
    id: record.id,
    name: record.data.name,
    email: record.data.email,
    phone: record.data.phone,
    address: record.data.address,
    status: record.data.status,
    trainingPercent: record.data.trainingPercent,
    hours: record.data.hours,
    createdAt: record.data.createdAt,
  }
}

function mapApplication(record: WithId<VolunteerApplicationDoc>): AdminVolunteerApplication {
  return {
    id: record.id,
    name: record.data.name,
    email: record.data.email,
    phone: record.data.phone,
    address: record.data.address,
    interests: record.data.interests,
    availability: record.data.availability,
    message: record.data.message,
    status: record.data.status,
    createdAt: record.data.createdAt,
  }
}

function mapProfile(record: WithId<ProfileDoc>): AdminProfile {
  return {
    uid: record.data.uid,
    displayName: record.data.displayName,
    email: record.data.email,
    role: record.data.role,
  }
}

function mapLiveChat(record: WithId<LiveChatDoc>): AdminLiveChatThread {
  return {
    id: record.id,
    guestName: record.data.guestName,
    guestEmail: record.data.guestEmail,
    status: record.data.status,
    createdAt: record.data.createdAt,
    updatedAt: record.data.updatedAt,
  }
}

function mapInbox(record: WithId<InboxMessageDoc>): AdminInboxThread {
  return {
    id: record.id,
    userId: record.data.userId,
    sender: record.data.sender,
    body: record.data.body,
    fromRole: record.data.fromRole,
    createdAt: record.data.createdAt,
  }
}

function mapEvent(record: WithId<EventRecordDoc>): AdminEvent {
  return {
    id: record.id,
    title: record.data.title,
    slug: record.data.slug,
    summary: record.data.summary,
    description: record.data.description,
    date: record.data.date,
    time: record.data.time,
    location: record.data.location,
    status: record.data.status,
    createdAt: record.data.createdAt,
  }
}

function buildChartBars(hours: readonly WithId<VolunteerHoursDoc>[]): readonly AdminChartBar[] {
  const months = lastSevenMonths()
  return months.map((m) => {
    const total = hours
      .filter((h) => h.data.month === m.key)
      .reduce((sum, h) => sum + h.data.hours, 0)
    return { id: m.key, label: m.label, hours: total }
  })
}

function buildReportMetrics(
  hours: readonly WithId<VolunteerHoursDoc>[],
  reports: readonly WithId<ReportDoc>[],
  volunteers: readonly AdminVolunteer[],
): readonly AdminReportMetric[] {
  const quarterHours = hours
    .filter((h) => isCurrentQuarter(h.data.createdAt))
    .reduce((sum, h) => sum + h.data.hours, 0)
  const yearReports = reports.filter((r) => isCurrentYear(r.data.createdAt)).length
  const activeVolunteers = volunteers.filter((v) => v.status === 'active').length
  const retentionRate =
    volunteers.length > 0 ? Math.round((activeVolunteers / volunteers.length) * 100) : 0
  return [
    {
      id: 'quarter-hours',
      value: `${quarterHours.toLocaleString()} hrs`,
      caption: 'Volunteer hours logged this quarter',
    },
    { id: 'year-reports', value: `${yearReports}`, caption: 'Reports generated this year' },
    { id: 'retention-rate', value: `${retentionRate}%`, caption: 'Volunteer retention rate' },
  ]
}

function buildMessages(contacts: readonly WithId<ContactMessageDoc>[]): readonly AdminMessage[] {
  return contacts
    .map((c) => ({
      id: c.id,
      sender: `${c.data.name} (Enquiry)`,
      preview: c.data.message,
      kind: 'enquiry' as const,
      createdAt: c.data.createdAt,
    }))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
}

export function useAdminDashboardData(): UseAdminDashboardDataReturn {
  const loading = ref<boolean>(true)
  const error = ref<string>('')

  const volunteers = ref<readonly AdminVolunteer[]>([])
  const applications = ref<readonly AdminVolunteerApplication[]>([])
  const events = ref<readonly AdminEvent[]>([])
  const chartBars = ref<readonly AdminChartBar[]>([])
  const reportMetrics = ref<readonly AdminReportMetric[]>([])
  const messages = ref<readonly AdminMessage[]>([])
  const inboxMessages = ref<readonly AdminInboxThread[]>([])
  const profiles = ref<readonly AdminProfile[]>([])
  const liveChats = ref<readonly AdminLiveChatThread[]>([])
  const openEnquiries = ref<number>(0)

  let unsubVolunteers: (() => void) | undefined
  let unsubApplications: (() => void) | undefined
  let unsubEvents: (() => void) | undefined
  let unsubHours: (() => void) | undefined
  let unsubReports: (() => void) | undefined
  let unsubInbox: (() => void) | undefined
  let unsubProfiles: (() => void) | undefined
  let unsubLiveChats: (() => void) | undefined

  function handleError(message: string): void {
    error.value = message
    loading.value = false
  }

  onMounted(() => {
    let volunteersReady = false
    let eventsReady = false
    let hoursReady = false
    let reportsReady = false

    function checkReady(): void {
      if (volunteersReady && eventsReady && hoursReady && reportsReady) {
        loading.value = false
      }
    }

    unsubVolunteers = subscribeVolunteers(
      (records) => {
        volunteers.value = records.map(mapVolunteer)
        reportMetrics.value = buildReportMetrics(hoursSnapshot, reportsSnapshot, volunteers.value)
        volunteersReady = true
        checkReady()
      },
      () => handleError('Unable to load volunteers.'),
    )

    unsubApplications = subscribeVolunteerApplications(
      (records) => {
        applications.value = records
          .slice()
          .sort((left, right) => right.data.createdAt - left.data.createdAt)
          .map(mapApplication)
      },
      () => handleError('Unable to load volunteer applications.'),
    )

    unsubEvents = subscribeEvents(
      (records) => {
        events.value = records.map(mapEvent)
        eventsReady = true
        checkReady()
      },
      () => handleError('Unable to load events.'),
    )

    let hoursSnapshot: readonly WithId<VolunteerHoursDoc>[] = []
    let reportsSnapshot: readonly WithId<ReportDoc>[] = []

    unsubHours = subscribeVolunteerHours(
      (records) => {
        hoursSnapshot = records
        chartBars.value = buildChartBars(records)
        reportMetrics.value = buildReportMetrics(records, reportsSnapshot, volunteers.value)
        hoursReady = true
        checkReady()
      },
      () => handleError('Unable to load volunteer hours.'),
    )

    unsubReports = subscribeReports(
      (records) => {
        reportsSnapshot = records
        reportMetrics.value = buildReportMetrics(hoursSnapshot, records, volunteers.value)
        reportsReady = true
        checkReady()
      },
      () => handleError('Unable to load reports.'),
    )

    unsubInbox = subscribeInboxMessages(
      (records) => {
        inboxMessages.value = records
          .slice()
          .sort((left, right) => right.data.createdAt - left.data.createdAt)
          .map(mapInbox)
      },
      () => handleError('Unable to load dashboard messages.'),
    )

    unsubProfiles = subscribeProfiles(
      (records) => {
        profiles.value = records.map(mapProfile)
      },
      () => handleError('Unable to load recipient profiles.'),
    )

    unsubLiveChats = subscribeLiveChats(
      (records) => {
        liveChats.value = records
          .slice()
          .sort((left, right) => right.data.updatedAt - left.data.updatedAt)
          .map(mapLiveChat)
      },
      () => handleError('Unable to load live chats.'),
    )

    void getRecentContactMessages(5)
      .then((contacts) => {
        messages.value = buildMessages(contacts)
      })
      .catch(() => handleError('Unable to load messages.'))

    void countContactMessages()
      .then((count) => {
        openEnquiries.value = count
      })
      .catch(() => handleError('Unable to load enquiries.'))
  })

  onUnmounted(() => {
    unsubVolunteers?.()
    unsubApplications?.()
    unsubEvents?.()
    unsubHours?.()
    unsubReports?.()
    unsubInbox?.()
    unsubProfiles?.()
    unsubLiveChats?.()
  })

  const kpiCards = computed<readonly AdminKpiCard[]>(() => {
    const totalVolunteers = volunteers.value.length
    const pendingRegistrations = volunteers.value.filter((v) => v.status === 'pending').length
    const upcomingEvents = events.value.filter((e) => e.status === 'published').length
    return [
      {
        id: 'total-volunteers',
        label: 'TOTAL VOLUNTEERS',
        value: totalVolunteers,
        caption: '+4 this month',
      },
      {
        id: 'pending-registrations',
        label: 'PENDING REGISTRATIONS',
        value: pendingRegistrations,
        caption: 'Awaiting review',
      },
      {
        id: 'upcoming-events',
        label: 'UPCOMING EVENTS',
        value: upcomingEvents,
        caption: 'Next 30 days',
      },
      {
        id: 'open-enquiries',
        label: 'OPEN ENQUIRIES',
        value: openEnquiries.value,
        caption: 'Needs response',
      },
    ]
  })

  const data = computed<AdminDashboardData>(() => ({
    greetingSubtitle,
    kpiCards: kpiCards.value,
    volunteers: volunteers.value,
    applications: applications.value,
    events: events.value,
    chartBars: chartBars.value,
    reportMetrics: reportMetrics.value,
    messages: messages.value,
    inboxMessages: inboxMessages.value,
    profiles: profiles.value,
    liveChats: liveChats.value,
    complianceFeatures,
  }))

  return { loading, error, data, greetingSubtitle }
}
