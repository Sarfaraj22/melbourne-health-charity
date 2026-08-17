export type DonationFrequency = 'one-off' | 'monthly'

export type TransportRequired = 'yes' | 'no'

export interface ContactMessageDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly subject: string
  readonly message: string
  readonly createdAt: number
}

export interface AssistanceRequestDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly need: string
  readonly message: string
  readonly createdAt: number
}

export interface DonationDoc {
  readonly amount: number
  readonly frequency: DonationFrequency
  readonly name: string
  readonly email: string
  readonly message: string
  readonly createdAt: number
}

export interface VolunteerApplicationDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly interests: readonly string[]
  readonly availability: string
  readonly message: string
  readonly createdAt: number
}

export interface EventRegistrationDoc {
  readonly eventSlug: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly attendees: string
  readonly accessibilityRequirements: string
  readonly optInUpdates: boolean
  readonly createdAt: number
}

export type AdminVolunteerStatus = 'active' | 'pending'

export type AdminEventStatus = 'published' | 'draft'

export interface VolunteerRecordDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: number
  readonly hours: number
  readonly createdAt: number
}

export interface EventRecordDoc {
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

export interface VolunteerHoursDoc {
  readonly volunteerId: string
  readonly volunteerName: string
  readonly hours: number
  readonly month: string
  readonly createdAt: number
}

export interface ReportDoc {
  readonly title: string
  readonly type: string
  readonly createdAt: number
}

export interface AppointmentDoc {
  readonly name: string
  readonly date: string
  readonly time: string
  readonly serviceSlug: string
  readonly supportType: string
  readonly accessibilityRequirements: string
  readonly transportRequired: TransportRequired
  readonly createdAt: number
}
