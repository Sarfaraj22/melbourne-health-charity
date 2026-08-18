import type { GetSupportContent } from '@/types/support'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'
import lifeBuoyIcon from '@/assets/icons/life-buoy.svg?raw'

import getSupportHeroWebp from '@/assets/images/get-support-hero.webp'
import getSupportHeroJpg from '@/assets/images/get-support-hero.jpg'
import getSupportHeroSmallWebp from '@/assets/images/get-support-hero-400.webp'
import getSupportHeroSmallJpg from '@/assets/images/get-support-hero-400.jpg'

export function useGetSupportContent(): GetSupportContent {
  return {
    heroHeading: 'Get support',
    heroIntro:
      'Book an appointment, request help, or reach us another way. We support people with disability, families, and carers across Melbourne.',
    heroImage: {
      image: getSupportHeroWebp,
      imageJpg: getSupportHeroJpg,
      imageSmall: getSupportHeroSmallWebp,
      imageSmallJpg: getSupportHeroSmallJpg,
      imageAlt: 'A clinician wearing a stethoscope using a phone',
    },
    subpageLinks: [
      {
        id: 'book',
        label: 'Book an Appointment',
        to: '/get-support/book-appointment',
        icon: calendarDaysIcon,
        description: 'Request a time for support coordination, counselling, or a service visit.',
      },
      {
        id: 'live-chat',
        label: 'Live Chat',
        to: '/get-support/live-chat',
        icon: messageCircleIcon,
        description: 'Chat with our team during office hours, Monday to Friday.',
      },
      {
        id: 'request',
        label: 'Request Assistance',
        to: '/get-support/request-assistance',
        icon: lifeBuoyIcon,
        description: 'Tell us what you need and we will get back to you within two business days.',
      },
    ],
    crisisNote:
      'If you are in crisis, call Lifeline on 13 11 14 (24 hours). For non-urgent help you can also use our contact page.',
    bookIntro:
      'Request an appointment below. You can also browse services if you already know which program you need.',
    chatHeading: 'Live chat',
    chatIntro:
      'Live chat is available Monday to Friday, 9:00am – 5:00pm. Outside those hours, use the request form or phone 1800 123 456.',
    chatUnavailable:
      'If no one replies immediately, leave your message and we will follow up by email.',
    assistIntro:
      'Describe what you need — NDIS help, a callback, or support for a carer. We will reply within two business days.',
  }
}
