export type AdminVolunteerStatus = 'active' | 'pending'

export type AdminEventStatus = 'published' | 'draft'

export type AdminFormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface AdminVolunteer {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: number
  readonly hours: number
  readonly createdAt: number
}

export interface AdminVolunteerApplication {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly interests: readonly string[]
  readonly availability: string
  readonly message: string
  readonly status: 'pending' | 'approved' | 'denied'
  readonly createdAt: number
}

export interface AdminLiveChatThread {
  readonly id: string
  readonly guestName: string
  readonly guestEmail: string
  readonly origin: 'visitor' | 'registered'
  readonly userId: string
  readonly status: 'open' | 'closed'
  readonly createdAt: number
  readonly updatedAt: number
}

export interface AdminProfile {
  readonly uid: string
  readonly displayName: string
  readonly email: string
  readonly role: 'admin' | 'user' | 'volunteer'
}

export interface AdminEvent {
  readonly id: string
  readonly title: string
  readonly slug: string
  readonly summary: string
  readonly description: string
  readonly date: string
  readonly time: string
  readonly location: string
  readonly status: AdminEventStatus
  readonly createdAt: number
}

export interface AdminVolunteerHours {
  readonly id: string
  readonly volunteerId: string
  readonly volunteerName: string
  readonly hours: number
  readonly month: string
  readonly createdAt: number
}

export interface AdminReport {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly createdAt: number
}

export interface AdminKpiCard {
  readonly id: string
  readonly label: string
  readonly value: number
  readonly caption: string
}

export interface AdminChartBar {
  readonly id: string
  readonly label: string
  readonly hours: number
}

export interface AdminReportMetric {
  readonly id: string
  readonly value: string
  readonly caption: string
}

export interface AdminMessage {
  readonly id: string
  readonly sender: string
  readonly preview: string
  readonly kind: 'enquiry' | 'volunteer'
  readonly createdAt: number
}

export interface AdminComplianceFeature {
  readonly id: string
  readonly icon: string
  readonly title: string
  readonly description: string
}

export interface AdminContactEnquiry {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly subject: string
  readonly message: string
  readonly createdAt: number
  readonly repliedAt?: number
}

export interface AdminEmailRecord {
  readonly id: string
  readonly to: string
  readonly fromAddress: string
  readonly subject: string
  readonly body: string
  readonly source: 'compose' | 'bulk' | 'contact' | 'inbound'
  readonly folder: 'inbox' | 'sent'
  readonly threadId: string
  readonly contactId: string
  readonly createdAt: number
}

export interface AdminDashboardData {
  readonly greetingSubtitle: string
  readonly kpiCards: readonly AdminKpiCard[]
  readonly volunteers: readonly AdminVolunteer[]
  readonly applications: readonly AdminVolunteerApplication[]
  readonly events: readonly AdminEvent[]
  readonly chartBars: readonly AdminChartBar[]
  readonly reportMetrics: readonly AdminReportMetric[]
  readonly messages: readonly AdminMessage[]
  readonly inboxMessages: readonly AdminInboxThread[]
  readonly profiles: readonly AdminProfile[]
  readonly liveChats: readonly AdminLiveChatThread[]
  readonly emails: readonly AdminEmailRecord[]
  readonly contacts: readonly AdminContactEnquiry[]
  readonly complianceFeatures: readonly AdminComplianceFeature[]
}

export interface AdminInboxThread {
  readonly id: string
  readonly userId: string
  readonly sender: string
  readonly body: string
  readonly fromRole: 'admin' | 'user' | 'volunteer'
  readonly createdAt: number
}

export interface VolunteerFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: string
  readonly hours: string
}

export interface VolunteerFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
  readonly address?: string
  readonly trainingPercent?: string
  readonly hours?: string
}

export interface EventFormState {
  readonly title: string
  readonly slug: string
  readonly summary: string
  readonly description: string
  readonly date: string
  readonly time: string
  readonly location: string
  readonly status: AdminEventStatus
}

export interface EventFormErrors {
  readonly title?: string
  readonly slug?: string
  readonly date?: string
}
