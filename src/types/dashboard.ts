import type { ServiceImageSet } from '@/types/service'

export interface DashboardAppointment {
  readonly id: string
  readonly service: string
  readonly date: string
  readonly time: string
  readonly location: string
}

export interface DashboardMessage {
  readonly id: string
  readonly sender: string
  readonly preview: string
  readonly body: string
  readonly fromRole: 'admin' | 'user' | 'volunteer'
  readonly receivedAt: string
}

export type DashboardResourceKind = 'guide' | 'video' | 'article'

export interface DashboardSavedResource {
  readonly id: string
  readonly title: string
  readonly kind: DashboardResourceKind
  readonly href: string
}

export interface DashboardUpcomingEvent {
  readonly id: string
  readonly dateBadge: string
  readonly title: string
  readonly summary: string
  readonly images: ServiceImageSet
  readonly href: string
}

export interface DashboardSettingsRow {
  readonly id: string
  readonly label: string
  readonly value?: string
  readonly to?: string
}

export interface DashboardContent {
  readonly greetingSubtitle: string
  readonly settingsRows: readonly DashboardSettingsRow[]
}
