export type DonationFrequency = 'one-off' | 'monthly'

export type TransportRequired = 'yes' | 'no'

export interface ContactMessageDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly subject: string
  readonly message: string
  readonly createdAt: number
  readonly repliedAt?: number
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

export type VolunteerApplicationReviewStatus = 'pending' | 'approved' | 'denied'

export type MessageFromRole = 'admin' | 'user' | 'volunteer'

export type LiveChatStatus = 'open' | 'closed'

export type LiveChatOrigin = 'visitor' | 'registered'

export type LiveChatSender = 'visitor' | 'user' | 'volunteer' | 'admin'

export interface VolunteerApplicationDoc {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly interests: readonly string[]
  readonly availability: string
  readonly message: string
  readonly status: VolunteerApplicationReviewStatus
  readonly createdAt: number
  readonly reviewedAt?: number
}

export interface EventRegistrationDoc {
  readonly eventSlug: string
  readonly userId: string
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
  readonly address: string
  readonly status: AdminVolunteerStatus
  readonly trainingPercent: number
  readonly hours: number
  readonly authUid: string
  readonly coordinatorUid: string
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
  readonly userId: string
  readonly name: string
  readonly date: string
  readonly time: string
  readonly serviceSlug: string
  readonly supportType: string
  readonly accessibilityRequirements: string
  readonly transportRequired: TransportRequired
  readonly createdAt: number
}

export interface InboxMessageDoc {
  readonly userId: string
  readonly sender: string
  readonly body: string
  readonly fromRole: MessageFromRole
  readonly createdAt: number
}

export interface ProfileDoc {
  readonly uid: string
  readonly displayName: string
  readonly email: string
  readonly role: MessageFromRole
  readonly createdAt: number
}

export interface LiveChatDoc {
  readonly guestName: string
  readonly guestEmail: string
  readonly origin: LiveChatOrigin
  readonly userId: string
  readonly status: LiveChatStatus
  readonly createdAt: number
  readonly updatedAt: number
}

export interface LiveChatMessageDoc {
  readonly sender: LiveChatSender
  readonly body: string
  readonly createdAt: number
}

export interface SavedResourceDoc {
  readonly userId: string
  readonly resourceId: string
  readonly createdAt: number
}

export interface MessageThreadDoc {
  readonly participantUids: readonly string[]
  readonly createdAt: number
  readonly updatedAt: number
  readonly initiatedByUid: string
}

export interface ThreadMessageDoc {
  readonly senderUid: string
  readonly sender: string
  readonly fromRole: MessageFromRole
  readonly body: string
  readonly createdAt: number
}

export type EmailFolder = 'inbox' | 'sent'

export type EmailSource = 'compose' | 'bulk' | 'contact' | 'inbound'

export interface EmailDoc {
  readonly to: string
  readonly fromAddress: string
  readonly subject: string
  readonly body: string
  readonly source: EmailSource
  readonly folder: EmailFolder
  readonly threadId: string
  readonly contactId: string
  readonly createdAt: number
}
