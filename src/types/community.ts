export interface CommunityImageSet {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export interface NewsArticle {
  readonly id: string
  readonly publishedOn: string
  readonly headline: string
  readonly excerpt: string
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export interface SuccessStory {
  readonly id: string
  readonly title: string
  readonly name: string
  readonly summary: string
  readonly images: CommunityImageSet
}

export interface Testimonial {
  readonly id: string
  readonly quote: string
  readonly name: string
  readonly role: string
}

export interface CommunitySocialChannel {
  readonly id: string
  readonly label: string
  readonly description: string
  readonly icon: string
}

export interface CommunityContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly heroImage: CommunityImageSet
  readonly news: readonly NewsArticle[]
  readonly stories: readonly SuccessStory[]
  readonly testimonials: readonly Testimonial[]
  readonly socialChannels: readonly CommunitySocialChannel[]
}
