export type AdminVolunteerStatus = 'active' | 'pending'

export type AdminEventStatus = 'published' | 'draft'

export type AdminFormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface AdminVolunteer {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: number
  readonly hours: number
  readonly createdAt: number
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

export interface AdminDashboardData {
  readonly greetingSubtitle: string
  readonly kpiCards: readonly AdminKpiCard[]
  readonly volunteers: readonly AdminVolunteer[]
  readonly events: readonly AdminEvent[]
  readonly chartBars: readonly AdminChartBar[]
  readonly reportMetrics: readonly AdminReportMetric[]
  readonly messages: readonly AdminMessage[]
  readonly complianceFeatures: readonly AdminComplianceFeature[]
}

export interface VolunteerFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: string
  readonly hours: string
}

export interface VolunteerFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
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
