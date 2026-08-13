export interface QuickAccessItem {
  readonly id: string
  readonly label: string
  readonly to: string
  readonly icon: string
}

export interface EventItem {
  readonly id: string
  readonly dateBadge: string
  readonly title: string
  readonly description: string
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
  readonly detailsTo: string
}

export interface NewsItem {
  readonly id: string
  readonly publishedOn: string
  readonly headline: string
  readonly excerpt: string
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
  readonly readMoreTo: string
}

export interface HomeContent {
  readonly quickAccess: readonly QuickAccessItem[]
  readonly events: readonly EventItem[]
  readonly news: readonly NewsItem[]
}
