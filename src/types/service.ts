export interface ServiceImageSet {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export type ServiceDetailVariant = 'booking' | 'info' | 'eligibility-checker'

export interface ServiceDetail {
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly eligibility: string
  readonly location: string
  readonly cost: string
  readonly availability: string
  readonly icon: string
  readonly variant: ServiceDetailVariant
}

interface ServiceCategoryBase {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly icon: string
  readonly featured?: boolean
  readonly images?: ServiceImageSet
}

export type ServiceCategory =
  | (ServiceCategoryBase & { readonly kind: 'single'; readonly detail: ServiceDetail })
  | (ServiceCategoryBase & {
      readonly kind: 'group'
      readonly subServices: readonly ServiceDetail[]
    })

export interface BreadcrumbItem {
  readonly label: string
  readonly to?: string
}

export interface SupportChannel {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly href: string
}

export type SupportType = 'in-person' | 'telehealth' | 'phone'

export type TransportRequired = 'yes' | 'no'

export interface BookingFormState {
  readonly name: string
  readonly date: string
  readonly time: string
  readonly supportType: SupportType | ''
  readonly accessibilityRequirements: string
  readonly transportRequired: TransportRequired
}

export interface BookingFormErrors {
  readonly name?: string
  readonly date?: string
  readonly time?: string
  readonly supportType?: string
}

export interface ServicesContent {
  readonly categories: readonly ServiceCategory[]
  readonly supportChannels: readonly SupportChannel[]
}

export interface EligibilityOption {
  readonly value: string
  readonly label: string
}

export interface EligibilityQuestion {
  readonly id: string
  readonly question: string
  readonly helpText?: string
  readonly options: readonly EligibilityOption[]
}

export type EligibilityOutcomeTone = 'positive' | 'caution' | 'neutral'

export interface EligibilityOutcome {
  readonly tone: EligibilityOutcomeTone
  readonly heading: string
  readonly message: string
}
