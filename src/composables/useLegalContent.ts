import type { LegalDocument, LegalSlug } from '@/types/legal'

const accessibilityStatement: LegalDocument = {
  slug: 'accessibility-statement',
  title: 'Accessibility Statement',
  lastUpdated: '15 August 2026',
  intro:
    'Melbourne Disability Support Charity is committed to making this website usable by people with disability, including people who use assistive technologies.',
  sections: [
    {
      id: 'commitment',
      heading: 'Our commitment',
      paragraphs: [
        'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. Pages use semantic headings, keyboard access, visible focus, and text alternatives for images.',
        'We test with keyboard-only navigation and screen readers during development. If something does not work for you, please tell us so we can fix it.',
      ],
    },
    {
      id: 'features',
      heading: 'Accessibility features on this site',
      paragraphs: [
        'A skip link takes you to the main content. The accessibility bar at the top of every page lets you change text size, turn on high contrast, enlarge buttons, underline links, and use a plainer reading layout. Language stays English here; other languages and Easy Read can be requested from this statement.',
        'Forms include labels, error messages, and success confirmation. We avoid relying on colour alone to convey meaning.',
      ],
    },
    {
      id: 'contact-access',
      heading: 'Requesting information in another format',
      paragraphs: [
        'You can ask for Easy Read, large print, or an Auslan interpreter for appointments. Call 1800 123 456 or email inquiry@melbournehealth.org.au, Monday to Friday, 9:00am – 5:00pm.',
      ],
    },
  ],
}

const privacyPolicy: LegalDocument = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  lastUpdated: '15 August 2026',
  intro:
    'This policy explains how Melbourne Disability Support Charity collects, uses, and stores personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.',
  sections: [
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      paragraphs: [
        'We may collect your name, contact details, and information you give us in forms (for example booking, volunteer, or donation requests). We only ask for what we need to respond to you.',
        'We do not collect health or NDIS details through this website unless you choose to include them in a message you send us.',
      ],
    },
    {
      id: 'how-we-use',
      heading: 'How we use your information',
      paragraphs: [
        'We use your details to answer enquiries, arrange appointments, process volunteer applications, and send newsletters you have asked for.',
        'We do not sell your personal information. We only share it with service providers who help us run the charity, and only as needed.',
      ],
    },
    {
      id: 'your-rights',
      heading: 'Access and correction',
      paragraphs: [
        'You can ask to see or correct personal information we hold about you. Email inquiry@melbournehealth.org.au or write to 123 Support Street, Melbourne VIC 3000.',
        'If you are not satisfied with how we handle a privacy matter, you can contact the Office of the Australian Information Commissioner.',
      ],
    },
  ],
}

const termsOfUse: LegalDocument = {
  slug: 'terms-of-use',
  title: 'Terms of Use',
  lastUpdated: '15 August 2026',
  intro:
    'These terms apply when you use the Melbourne Disability Support Charity website. By using the site, you agree to these terms.',
  sections: [
    {
      id: 'using-the-site',
      heading: 'Using this website',
      paragraphs: [
        'Content is provided for general information about our Melbourne disability support programs. It is not a substitute for professional advice about your NDIS plan or health care.',
        'Please use the site lawfully. Do not submit false information in forms or attempt to disrupt the service.',
      ],
    },
    {
      id: 'bookings-donations',
      heading: 'Bookings, donations, and applications',
      paragraphs: [
        'Online booking, donation, and volunteer forms are requests only. We will confirm appointments and donations separately. This site does not process live payments.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes',
      paragraphs: [
        'We may update these terms from time to time. The date at the top of this page shows when they were last changed.',
      ],
    },
  ],
}

const cookiePolicy: LegalDocument = {
  slug: 'cookie-policy',
  title: 'Cookie Policy',
  lastUpdated: '15 August 2026',
  intro: 'This page explains how this website uses cookies and similar storage in your browser.',
  sections: [
    {
      id: 'what-cookies-are',
      heading: 'What cookies are',
      paragraphs: [
        'Cookies are small text files stored on your device. They can remember settings or help a site work.',
      ],
    },
    {
      id: 'what-we-use',
      heading: 'What we use',
      paragraphs: [
        'This website uses only essential cookies needed for the site to function (for example remembering a page you are on). We do not use advertising or third-party tracking cookies on this site.',
        'If we add optional analytics later, we will update this policy and ask before setting non-essential cookies.',
      ],
    },
    {
      id: 'how-to-control',
      heading: 'How to control cookies',
      paragraphs: [
        'You can delete or block cookies in your browser settings. Blocking essential cookies may affect how some pages work.',
        'Questions about this policy can be sent to inquiry@melbournehealth.org.au.',
      ],
    },
  ],
}

const documentsBySlug: Record<LegalSlug, LegalDocument> = {
  'accessibility-statement': accessibilityStatement,
  'privacy-policy': privacyPolicy,
  'terms-of-use': termsOfUse,
  'cookie-policy': cookiePolicy,
}

export function isLegalSlug(value: string): value is LegalSlug {
  return (
    value === 'accessibility-statement' ||
    value === 'privacy-policy' ||
    value === 'terms-of-use' ||
    value === 'cookie-policy'
  )
}

export function getLegalDocument(slug: string): LegalDocument | undefined {
  if (!isLegalSlug(slug)) {
    return undefined
  }
  return documentsBySlug[slug]
}
