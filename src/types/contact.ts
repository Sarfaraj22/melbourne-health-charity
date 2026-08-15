export interface ContactImageSet {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly imageAlt: string
}

export interface ContactMethod {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly href: string
  readonly ctaLabel: string
}

export interface ContactOfficeHour {
  readonly day: string
  readonly time: string
}

export interface ContactOfficeInfo {
  readonly addressLines: readonly string[]
  readonly phone: string
  readonly phoneHref: string
  readonly email: string
  readonly emailHref: string
  readonly hours: readonly ContactOfficeHour[]
}

export type ContactEmergencyKind = 'crisis' | 'support-worker'

export interface ContactEmergencyContact {
  readonly id: string
  readonly kind: ContactEmergencyKind
  readonly label: string
  readonly phone: string
  readonly phoneHref: string
  readonly hours: string
}

export interface ContactSocialLink {
  readonly label: string
  readonly icon: string
  readonly to: string
}

export interface ContactFormState {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly subject: string
  readonly message: string
}

export interface ContactFormErrors {
  readonly name?: string
  readonly email?: string
  readonly phone?: string
  readonly subject?: string
  readonly message?: string
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success'

export interface ContactContent {
  readonly heroHeading: string
  readonly heroIntro: string
  readonly heroImage: ContactImageSet
  readonly methods: readonly ContactMethod[]
  readonly office: ContactOfficeInfo
  readonly officeMap: ContactImageSet
  readonly emergencyContacts: readonly ContactEmergencyContact[]
  readonly socialLinks: readonly ContactSocialLink[]
}
