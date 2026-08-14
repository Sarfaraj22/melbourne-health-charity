export type ResourceTopicId = 'disability-type' | 'mental-health' | 'carers' | 'ndis'

export type ResourceFormatId = 'videos' | 'articles' | 'easy-read'

export type ResourceFormat = 'guide' | 'article' | 'video' | 'easy-read'

export interface ResourceImageSet {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export interface ResourceItem {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly description: string
  readonly format: ResourceFormat
  readonly topics: readonly ResourceTopicId[]
  readonly formats: readonly ResourceFormatId[]
  readonly fileUrl: string
  readonly icon: string
  readonly images: ResourceImageSet
}

export interface ResourceFilterOption<TId extends string> {
  readonly id: TId
  readonly label: string
}

export type ResourceFilterGroup =
  | {
      readonly id: 'topics'
      readonly legend: string
      readonly options: readonly ResourceFilterOption<ResourceTopicId>[]
    }
  | {
      readonly id: 'formats'
      readonly legend: string
      readonly options: readonly ResourceFilterOption<ResourceFormatId>[]
    }

export interface ResourcesContent {
  readonly resources: readonly ResourceItem[]
  readonly filterGroups: readonly ResourceFilterGroup[]
}
