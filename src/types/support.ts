import type { ExploreLink, PageImageSet } from '@/types/explore'

export interface GetSupportContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly heroImage: PageImageSet
  readonly subpageLinks: readonly ExploreLink[]
  readonly crisisNote: string
  readonly bookIntro: string
  readonly chatHeading: string
  readonly chatIntro: string
  readonly chatUnavailable: string
  readonly assistIntro: string
}

export interface AssistanceFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly need: string
  readonly message: string
}

export interface AssistanceFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
  readonly need?: string
  readonly message?: string
}

export type AssistanceFormStatus = 'idle' | 'submitting' | 'success' | 'error'
