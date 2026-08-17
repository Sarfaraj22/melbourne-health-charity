import type { ExploreLink, PageImageSet } from '@/types/explore'

export type DonationFrequency = 'one-off' | 'monthly'

export interface DonationFormState {
  readonly amountPreset: '25' | '50' | '100' | 'custom'
  readonly customAmount: string
  readonly frequency: DonationFrequency
  readonly name: string
  readonly email: string
  readonly message: string
}

export interface DonationFormErrors {
  readonly amount?: string
  readonly name?: string
  readonly email?: string
}

export type DonationFormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface FundraisingCampaign {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly ctaLabel: string
  readonly to: string
  readonly images: PageImageSet
}

export interface DonateFaq {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export interface DonateContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly heroImage: PageImageSet
  readonly subpageLinks: readonly ExploreLink[]
  readonly donateIntro: string
  readonly campaignsIntro: string
  readonly campaigns: readonly FundraisingCampaign[]
  readonly corporateIntro: string
  readonly corporatePoints: readonly string[]
  readonly faqsIntro: string
  readonly faqs: readonly DonateFaq[]
}
