import type {
  BookableServiceOption,
  ServiceCategory,
  ServiceDetail,
  ServicesContent,
  SupportChannel,
} from '@/types/service'

import accessibilityIcon from '@/assets/icons/accessibility.svg?raw'
import brainIcon from '@/assets/icons/brain.svg?raw'
import usersIcon from '@/assets/icons/users.svg?raw'
import heartPulseIcon from '@/assets/icons/heart-pulse.svg?raw'
import clipboardCheckIcon from '@/assets/icons/clipboard-check.svg?raw'
import stethoscopeIcon from '@/assets/icons/stethoscope.svg?raw'
import activityIcon from '@/assets/icons/activity.svg?raw'
import clipboardListIcon from '@/assets/icons/clipboard-list.svg?raw'
import handHeartIcon from '@/assets/icons/hand-heart.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import usersRoundIcon from '@/assets/icons/users-round.svg?raw'
import fileTextIcon from '@/assets/icons/file-text.svg?raw'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'
import phoneIcon from '@/assets/icons/phone.svg?raw'
import mailIcon from '@/assets/icons/mail.svg?raw'

import serviceDisabilityWebp from '@/assets/images/service-disability.webp'
import serviceDisabilityJpg from '@/assets/images/service-disability.jpg'
import serviceDisabilitySmallWebp from '@/assets/images/service-disability-400.webp'
import serviceDisabilitySmallJpg from '@/assets/images/service-disability-400.jpg'
import serviceMentalHealthWebp from '@/assets/images/service-mental-health.webp'
import serviceMentalHealthJpg from '@/assets/images/service-mental-health.jpg'
import serviceMentalHealthSmallWebp from '@/assets/images/service-mental-health-400.webp'
import serviceMentalHealthSmallJpg from '@/assets/images/service-mental-health-400.jpg'
import serviceCommunityWebp from '@/assets/images/service-community.webp'
import serviceCommunityJpg from '@/assets/images/service-community.jpg'
import serviceCommunitySmallWebp from '@/assets/images/service-community-400.webp'
import serviceCommunitySmallJpg from '@/assets/images/service-community-400.jpg'
import serviceHealthWellbeingWebp from '@/assets/images/service-health-wellbeing.webp'
import serviceHealthWellbeingJpg from '@/assets/images/service-health-wellbeing.jpg'
import serviceHealthWellbeingSmallWebp from '@/assets/images/service-health-wellbeing-400.webp'
import serviceHealthWellbeingSmallJpg from '@/assets/images/service-health-wellbeing-400.jpg'
import serviceNdisInformationWebp from '@/assets/images/service-ndis-information.webp'
import serviceNdisInformationJpg from '@/assets/images/service-ndis-information.jpg'
import serviceNdisInformationSmallWebp from '@/assets/images/service-ndis-information-400.webp'
import serviceNdisInformationSmallJpg from '@/assets/images/service-ndis-information-400.jpg'
import serviceEligibilityCheckerWebp from '@/assets/images/service-eligibility-checker.webp'
import serviceEligibilityCheckerJpg from '@/assets/images/service-eligibility-checker.jpg'
import serviceEligibilityCheckerSmallWebp from '@/assets/images/service-eligibility-checker-400.webp'
import serviceEligibilityCheckerSmallJpg from '@/assets/images/service-eligibility-checker-400.jpg'

const disabilitySubServices: readonly ServiceDetail[] = [
  {
    slug: 'occupational-therapy',
    title: 'Occupational Therapy',
    summary: 'Build, recover, or maintain the skills needed for daily living and independence.',
    description:
      'Occupational therapy helps people build, recover, or maintain the skills needed for daily living and independence.',
    eligibility:
      'Open to individuals with a disability, NDIS participants, and their carers. No referral required.',
    location: '123 Example Street, Melbourne VIC 3000',
    cost: 'Free for NDIS plan holders. Sliding-scale fee for others.',
    availability: 'Monday to Friday, 9:00am - 5:00pm',
    icon: stethoscopeIcon,
    variant: 'booking',
  },
  {
    slug: 'physiotherapy',
    title: 'Physiotherapy',
    summary:
      'Improve mobility, strength, and physical function with tailored exercise and therapy.',
    description:
      'Our physiotherapy team works with you to improve movement, manage pain, and build physical capacity through personalised exercise programs and hands-on therapy.',
    eligibility:
      'Available to NDIS participants, people with disability, and self-funded clients aged 7 and over.',
    location:
      '123 Example Street, Melbourne VIC 3000; home visits available across Melbourne metro',
    cost: 'NDIS-funded for eligible participants. Private health and Medicare rebates may apply.',
    availability: 'Monday to Friday, 8:00am - 6:00pm',
    icon: activityIcon,
    variant: 'booking',
  },
  {
    slug: 'support-coordination',
    title: 'Support Coordination',
    summary: 'Navigate your NDIS plan and connect with the right providers and community supports.',
    description:
      'Our support coordinators help NDIS participants understand their plans, find suitable providers, and coordinate services so you get the most from your funding.',
    eligibility:
      'NDIS participants with Support Coordination or Specialist Support Coordination in their plan.',
    location: '123 Example Street, Melbourne VIC 3000; phone and video sessions statewide',
    cost: 'Fully funded through NDIS plan — no out-of-pocket cost for eligible participants.',
    availability: 'Monday to Friday, 9:00am - 5:00pm',
    icon: clipboardListIcon,
    variant: 'booking',
  },
]

const mentalHealthSubServices: readonly ServiceDetail[] = [
  {
    slug: 'individual-counselling',
    title: 'Individual Counselling',
    summary:
      'One-on-one counselling tailored for people with disability and their unique experiences.',
    description:
      'Our counsellors provide confidential, person-centred support for anxiety, depression, grief, life transitions, and the emotional challenges of living with disability.',
    eligibility:
      'Open to individuals with disability aged 16 and over. Carers may access separate carer counselling sessions.',
    location: '123 Example Street, Melbourne VIC 3000; telehealth available statewide',
    cost: 'Free for NDIS plan holders. Bulk-billing available for eligible Medicare clients.',
    availability: 'Monday to Friday, 9:00am - 7:00pm',
    icon: handHeartIcon,
    variant: 'booking',
  },
  {
    slug: 'peer-support-groups',
    title: 'Peer Support Groups',
    summary:
      'Connect with others who share similar experiences in a safe, facilitated group setting.',
    description:
      'Facilitated peer support groups bring together people with disability to share experiences, build connections, and learn from one another in a welcoming environment.',
    eligibility:
      'Open to all people with disability aged 18 and over. Groups run by topic and interest.',
    location: '123 Example Street, Melbourne VIC 3000 and partner venues across Melbourne',
    cost: 'Free for all participants. NDIS plan holders may claim under Capacity Building.',
    availability: 'Weekly groups; see Events for the current timetable',
    icon: usersRoundIcon,
    variant: 'booking',
  },
  {
    slug: 'family-carer-counselling',
    title: 'Family & Carer Counselling',
    summary: 'Support for families and carers navigating the challenges of disability support.',
    description:
      'Dedicated counselling for parents, partners, and carers — helping you manage stress, maintain wellbeing, and strengthen your support role.',
    eligibility:
      'Open to family members and carers of people with disability. No formal diagnosis required.',
    location: '123 Example Street, Melbourne VIC 3000; telehealth available statewide',
    cost: 'Free for NDIS plan holders (where carer supports are funded). Medicare rebates may apply.',
    availability: 'Monday to Friday, 9:00am - 5:00pm',
    icon: heartHandshakeIcon,
    variant: 'booking',
  },
]

const categories: readonly ServiceCategory[] = [
  {
    id: 'disability-support-services',
    slug: 'disability-support-services',
    kind: 'group',
    title: 'Disability Support Services',
    summary:
      'Personalised support to help you live independently with dignity and choice across Melbourne.',
    icon: accessibilityIcon,
    featured: true,
    images: {
      image: serviceDisabilityWebp,
      imageJpg: serviceDisabilityJpg,
      imageSmall: serviceDisabilitySmallWebp,
      imageSmallJpg: serviceDisabilitySmallJpg,
      imageAlt: 'Support worker assisting a person with disability in the community',
    },
    subServices: disabilitySubServices,
  },
  {
    id: 'mental-health-support',
    slug: 'mental-health-support',
    kind: 'group',
    title: 'Mental Health Support',
    summary:
      'Counselling, peer support, and wellbeing programs for people with disability and their families.',
    icon: brainIcon,
    featured: true,
    images: {
      image: serviceMentalHealthWebp,
      imageJpg: serviceMentalHealthJpg,
      imageSmall: serviceMentalHealthSmallWebp,
      imageSmallJpg: serviceMentalHealthSmallJpg,
      imageAlt: 'A counsellor speaking with a client in a supportive environment',
    },
    subServices: mentalHealthSubServices,
  },
  {
    id: 'health-wellbeing-programs',
    slug: 'health-wellbeing-programs',
    kind: 'single',
    title: 'Health & Wellbeing Programs',
    summary: 'Group fitness, nutrition, and wellness programs designed for all abilities.',
    icon: heartPulseIcon,
    images: {
      image: serviceHealthWellbeingWebp,
      imageJpg: serviceHealthWellbeingJpg,
      imageSmall: serviceHealthWellbeingSmallWebp,
      imageSmallJpg: serviceHealthWellbeingSmallJpg,
      imageAlt: 'People participating in an inclusive group fitness session',
    },
    detail: {
      slug: 'health-wellbeing-programs',
      title: 'Health & Wellbeing Programs',
      summary: 'Group fitness, nutrition, and wellness programs designed for all abilities.',
      description:
        'Join our inclusive health and wellbeing programs — from adapted fitness classes and nutrition workshops to mindfulness sessions tailored for people with disability.',
      eligibility:
        'Open to NDIS participants and community members of all abilities. Programs are adapted to individual needs.',
      location: '123 Example Street, Melbourne VIC 3000 and partner venues across Melbourne',
      cost: 'Free for NDIS plan holders. Community programs from $10 per session.',
      availability: 'Weekly group sessions; see Events for the current timetable',
      icon: heartPulseIcon,
      variant: 'info',
    },
  },
  {
    id: 'ndis-information',
    slug: 'ndis-information',
    kind: 'single',
    title: 'NDIS Information',
    summary: 'Guidance on navigating the NDIS — from access requests to plan reviews and appeals.',
    icon: fileTextIcon,
    images: {
      image: serviceNdisInformationWebp,
      imageJpg: serviceNdisInformationJpg,
      imageSmall: serviceNdisInformationSmallWebp,
      imageSmallJpg: serviceNdisInformationSmallJpg,
      imageAlt: 'A support worker reviewing NDIS documents with a participant',
    },
    detail: {
      slug: 'ndis-information',
      title: 'NDIS Information',
      summary:
        'Guidance on navigating the NDIS — from access requests to plan reviews and appeals.',
      description:
        'Our NDIS information service helps you understand eligibility, prepare access requests, navigate plan reviews, and connect with the right supports under your funding.',
      eligibility:
        'Available to anyone exploring NDIS access, current participants, and their carers and families.',
      location: '123 Example Street, Melbourne VIC 3000; phone and video sessions statewide',
      cost: 'Free information sessions. Plan management advice included for registered clients.',
      availability:
        'Monday to Friday, 9:00am - 5:00pm; drop-in sessions Wednesday 10:00am - 2:00pm',
      icon: fileTextIcon,
      variant: 'info',
    },
  },
  {
    id: 'community-outreach',
    slug: 'community-outreach',
    kind: 'single',
    title: 'Community Outreach',
    summary:
      'Connect with local programs, social activities, and outreach support in your neighbourhood.',
    icon: usersIcon,
    images: {
      image: serviceCommunityWebp,
      imageJpg: serviceCommunityJpg,
      imageSmall: serviceCommunitySmallWebp,
      imageSmallJpg: serviceCommunitySmallJpg,
      imageAlt: 'A diverse group of people participating in a community activity outdoors',
    },
    detail: {
      slug: 'community-outreach',
      title: 'Community Outreach',
      summary:
        'Connect with local programs, social activities, and outreach support in your neighbourhood.',
      description:
        'Our community outreach team brings services directly to you — from home visits and local events to partnerships with councils and community groups across Melbourne.',
      eligibility:
        'Open to all people with disability and their families in the Melbourne metro area.',
      location:
        'Outreach across Melbourne metro; base office at 123 Example Street, Melbourne VIC 3000',
      cost: 'Most programs are free. Some events may have a small materials fee.',
      availability: 'Programs run throughout the week; see Events for upcoming activities',
      icon: usersIcon,
      variant: 'info',
    },
  },
  {
    id: 'eligibility-checker',
    slug: 'eligibility-checker',
    kind: 'single',
    title: 'Eligibility Checker',
    summary:
      'Find out which services and funding options you may be eligible for in a few simple steps.',
    icon: clipboardCheckIcon,
    images: {
      image: serviceEligibilityCheckerWebp,
      imageJpg: serviceEligibilityCheckerJpg,
      imageSmall: serviceEligibilityCheckerSmallWebp,
      imageSmallJpg: serviceEligibilityCheckerSmallJpg,
      imageAlt: 'A person using a laptop to check service eligibility online',
    },
    detail: {
      slug: 'eligibility-checker',
      title: 'Eligibility Checker',
      summary:
        'Find out which services and funding options you may be eligible for in a few simple steps.',
      description:
        'Our eligibility checker helps you understand which of our services and funding pathways — including NDIS, Medicare, and fee-for-service — may be available to you or someone you care for.',
      eligibility:
        'Anyone can use the eligibility checker. No personal details required for initial screening.',
      location: 'Online and in-person at 123 Example Street, Melbourne VIC 3000',
      cost: 'Free',
      availability: 'Available online 24/7; in-person support Monday to Friday, 9:00am - 5:00pm',
      icon: clipboardCheckIcon,
      variant: 'eligibility-checker',
    },
  },
]

const supportChannels: readonly SupportChannel[] = [
  {
    id: 'live-chat',
    title: 'Live Chat',
    description: 'Chat with our support team in real time',
    icon: messageCircleIcon,
    href: '/contact',
  },
  {
    id: 'call-us',
    title: 'Call Us',
    description: '1800 000 000, Mon-Fri 9am-5pm',
    icon: phoneIcon,
    href: 'tel:1800000000',
  },
  {
    id: 'email',
    title: 'Email',
    description: 'support@healthcharity.org.au',
    icon: mailIcon,
    href: 'mailto:support@healthcharity.org.au',
  },
]

export function getBookableServices(): readonly BookableServiceOption[] {
  const options: BookableServiceOption[] = []

  for (const category of categories) {
    if (category.kind === 'group') {
      for (const subService of category.subServices) {
        if (subService.variant === 'booking') {
          options.push({ slug: subService.slug, title: subService.title })
        }
      }
      continue
    }

    if (category.detail.variant === 'booking') {
      options.push({ slug: category.detail.slug, title: category.detail.title })
    }
  }

  return options
}

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getSubServiceBySlug(
  categorySlug: string,
  subSlug: string,
): ServiceDetail | undefined {
  const category = getCategoryBySlug(categorySlug)
  if (category === undefined || category.kind !== 'group') {
    return undefined
  }
  return category.subServices.find((sub) => sub.slug === subSlug)
}

export function getFeaturedCategories(): readonly ServiceCategory[] {
  return categories.filter((category) => category.featured === true)
}

export function useServicesContent(): ServicesContent {
  return { categories, supportChannels }
}
