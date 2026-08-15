export type LegalSlug =
  'accessibility-statement' | 'privacy-policy' | 'terms-of-use' | 'cookie-policy'

export interface LegalSection {
  readonly id: string
  readonly heading: string
  readonly paragraphs: readonly string[]
}

export interface LegalDocument {
  readonly slug: LegalSlug
  readonly title: string
  readonly lastUpdated: string
  readonly intro: string
  readonly sections: readonly LegalSection[]
}
