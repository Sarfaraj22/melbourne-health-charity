import type { ComputedRef } from 'vue'
import type { ServiceImageSet } from '@/types/service'

export type EventStatus = 'current' | 'future' | 'past'

export interface EventDetail {
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly date: string
  readonly dateBadge: string
  readonly time: string
  readonly location: string
  readonly cost: string
  readonly status: EventStatus
  readonly images: ServiceImageSet
  readonly registrationOpen: boolean
}

export interface EventRegistrationFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly attendees: string
  readonly accessibilityRequirements: string
  readonly optInUpdates: boolean
}

export interface EventRegistrationFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
  readonly attendees?: string
}

export interface EventsContent {
  readonly events: ComputedRef<readonly EventDetail[]>
  readonly currentEvents: ComputedRef<readonly EventDetail[]>
  readonly futureEvents: ComputedRef<readonly EventDetail[]>
}
