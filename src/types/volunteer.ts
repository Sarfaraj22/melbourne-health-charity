export interface VolunteerImageSet {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export interface VolunteerSubpageLink {
  readonly id: string
  readonly label: string
  readonly to: string
  readonly icon: string
  readonly description: string
}

export interface VolunteerBenefit {
  readonly id: string
  readonly icon: string
  readonly title: string
  readonly description: string
}

export interface VolunteerStep {
  readonly id: string
  readonly title: string
  readonly description: string
}

export interface VolunteerProfile {
  readonly name: string
  readonly role: string
  readonly initials: string
}

export interface VolunteerStat {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly caption: string
}

export interface VolunteerTrainingProgress {
  readonly percent: number
}

export interface VolunteerEvent extends VolunteerImageSet {
  readonly id: string
  readonly dateBadge: string
  readonly title: string
  readonly description: string
}

export type VolunteerOpportunityCategory =
  'event-support' | 'companionship' | 'admin' | 'outdoor' | 'mentoring'

export interface VolunteerOpportunity {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: VolunteerOpportunityCategory
  readonly categoryLabel: string
  readonly icon: string
  readonly commitment: string
}

export interface VolunteerFilterOption<TId extends string> {
  readonly id: TId
  readonly label: string
}

export interface VolunteerFilterGroup {
  readonly id: 'categories'
  readonly legend: string
  readonly options: readonly VolunteerFilterOption<VolunteerOpportunityCategory>[]
}

export interface VolunteerMessage {
  readonly id: string
  readonly sender: string
  readonly preview: string
  readonly body: string
  readonly fromRole: 'admin' | 'user' | 'volunteer'
}

export interface VolunteerCoordinator {
  readonly name: string
  readonly role: string
  readonly initials: string
}

export interface VolunteerFaq {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export interface VolunteerTrainingResource extends VolunteerImageSet {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly typeLabel: string
}

export interface VolunteerDashboardContent {
  readonly profile: VolunteerProfile
  readonly trainingProgress: VolunteerTrainingProgress
  readonly stats: readonly VolunteerStat[]
  readonly events: readonly VolunteerEvent[]
  readonly opportunities: readonly VolunteerOpportunity[]
  readonly messages: readonly VolunteerMessage[]
  readonly coordinator: VolunteerCoordinator
}

export type VolunteerAvailability = 'weekday' | 'weekend' | 'evening' | 'flexible'

export interface VolunteerApplicationFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly interests: ReadonlySet<VolunteerOpportunityCategory>
  readonly availability: VolunteerAvailability | ''
  readonly message: string
}

export interface VolunteerApplicationFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
  readonly address?: string
  readonly interests?: string
  readonly availability?: string
}

export type VolunteerApplicationStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface VolunteerContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly portalCtaLabel: string
  readonly portalCtaTo: string
  readonly subpageLinks: readonly VolunteerSubpageLink[]
  readonly benefits: readonly VolunteerBenefit[]
  readonly becomeIntro: string
  readonly becomeImage: VolunteerImageSet
  readonly steps: readonly VolunteerStep[]
  readonly opportunitiesIntro: string
  readonly opportunities: readonly VolunteerOpportunity[]
  readonly filterGroups: readonly VolunteerFilterGroup[]
  readonly faqsIntro: string
  readonly faqs: readonly VolunteerFaq[]
  readonly trainingIntro: string
  readonly trainingResources: readonly VolunteerTrainingResource[]
  readonly dashboard: VolunteerDashboardContent
}
