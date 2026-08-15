import type { ExploreLink, PageImageSet } from '@/types/explore'

export interface AboutMilestone {
  readonly id: string
  readonly year: string
  readonly title: string
  readonly description: string
}

export interface AboutTeamMember {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly initials: string
  readonly bio: string
}

export interface AboutValue {
  readonly id: string
  readonly title: string
  readonly description: string
}

export interface AboutPartner {
  readonly id: string
  readonly name: string
  readonly description: string
}

export interface AboutReport {
  readonly id: string
  readonly title: string
  readonly year: string
  readonly summary: string
  readonly fileUrl: string
}

export interface AboutContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly heroImage: PageImageSet
  readonly missionBlurb: string
  readonly subpageLinks: readonly ExploreLink[]
  readonly storyIntro: string
  readonly milestones: readonly AboutMilestone[]
  readonly teamIntro: string
  readonly team: readonly AboutTeamMember[]
  readonly missionStatement: string
  readonly values: readonly AboutValue[]
  readonly partnersIntro: string
  readonly partners: readonly AboutPartner[]
  readonly reportsIntro: string
  readonly reports: readonly AboutReport[]
}
