import type { ContactContent, ContactEmergencyContact, ContactMethod } from '@/types/contact'

import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'
import phoneIcon from '@/assets/icons/phone.svg?raw'
import mailIcon from '@/assets/icons/mail.svg?raw'
import facebookIcon from '@/assets/icons/facebook.svg?raw'
import twitterIcon from '@/assets/icons/twitter.svg?raw'
import instagramIcon from '@/assets/icons/instagram.svg?raw'
import linkedinIcon from '@/assets/icons/linkedin.svg?raw'

import contactHeroWebp from '@/assets/images/contact-hero.webp'
import contactHeroJpg from '@/assets/images/contact-hero.jpg'
import contactHeroSmallWebp from '@/assets/images/contact-hero-400.webp'
import contactHeroSmallJpg from '@/assets/images/contact-hero-400.jpg'
import contactMapWebp from '@/assets/images/contact-map.webp'
import contactMapJpg from '@/assets/images/contact-map.jpg'
import contactMapSmallWebp from '@/assets/images/contact-map-400.webp'
import contactMapSmallJpg from '@/assets/images/contact-map-400.jpg'

const methods: readonly ContactMethod[] = [
  {
    id: 'live-chat',
    title: 'Live Chat',
    description:
      'Available Monday to Friday, 9:00am – 5:00pm. Outside these hours, please leave a message using the form below.',
    icon: messageCircleIcon,
    href: '/get-support/chat',
    ctaLabel: 'Start live chat',
  },
  {
    id: 'telephone',
    title: 'Telephone',
    description: 'Call 1800 123 456, Monday to Friday, 9:00am – 5:00pm.',
    icon: phoneIcon,
    href: 'tel:1800123456',
    ctaLabel: 'Call us',
  },
  {
    id: 'email',
    title: 'Email',
    description:
      'Write to inquiry@melbournehealth.org.au and we will reply within two business days.',
    icon: mailIcon,
    href: 'mailto:inquiry@melbournehealth.org.au',
    ctaLabel: 'Email us',
  },
]

const emergencyContacts: readonly ContactEmergencyContact[] = [
  {
    id: 'crisis-line',
    kind: 'crisis',
    label: 'Crisis Support Line',
    phone: '13 11 14',
    phoneHref: 'tel:131114',
    hours: 'Lifeline, 24 hours a day, 7 days a week',
  },
  {
    id: 'support-worker',
    kind: 'support-worker',
    label: 'Contact Support Worker',
    phone: '0412 345 678',
    phoneHref: 'tel:0412345678',
    hours: 'Monday to Friday, 9:00am – 5:00pm',
  },
]

export function useContactContent(): ContactContent {
  return {
    heroHeading: 'Contact us',
    heroIntro:
      'We are here for people with disability, families, and carers across Melbourne. Reach us by form, phone, email, or live chat during office hours.',
    heroImage: {
      image: contactHeroWebp,
      imageJpg: contactHeroJpg,
      imageSmall: contactHeroSmallWebp,
      imageSmallJpg: contactHeroSmallJpg,
      imageAlt: 'Two colleagues talking together at a table',
    },
    methods,
    office: {
      addressLines: ['123 Support Street', 'Melbourne VIC 3000'],
      phone: '1800 123 456',
      phoneHref: 'tel:1800123456',
      email: 'inquiry@melbournehealth.org.au',
      emailHref: 'mailto:inquiry@melbournehealth.org.au',
      hours: [
        { day: 'Monday – Friday', time: '9:00am – 5:00pm' },
        { day: 'Saturday', time: 'Closed' },
        { day: 'Sunday', time: 'Closed' },
      ],
    },
    officeMap: {
      image: contactMapWebp,
      imageJpg: contactMapJpg,
      imageSmall: contactMapSmallWebp,
      imageSmallJpg: contactMapSmallJpg,
      imageAlt: 'Map of Melbourne CBD showing the charity office location',
    },
    emergencyContacts,
    socialLinks: [
      { label: 'Facebook', icon: facebookIcon, to: '/community' },
      { label: 'Twitter', icon: twitterIcon, to: '/community' },
      { label: 'Instagram', icon: instagramIcon, to: '/community' },
      { label: 'LinkedIn', icon: linkedinIcon, to: '/community' },
    ],
  }
}
