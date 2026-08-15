import type { EventItem, HomeContent, NewsItem, QuickAccessItem } from '@/types/home'
import { useCommunityContent } from '@/composables/useCommunityContent'

import accessibilityIcon from '@/assets/icons/accessibility.svg?raw'
import brainIcon from '@/assets/icons/brain.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import handHelpingIcon from '@/assets/icons/hand-helping.svg?raw'
import giftIcon from '@/assets/icons/gift.svg?raw'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'

import eventMorningTeaWebp from '@/assets/images/event-morning-tea.webp'
import eventMorningTeaJpg from '@/assets/images/event-morning-tea.jpg'
import eventMorningTeaSmallWebp from '@/assets/images/event-morning-tea-400.webp'
import eventMorningTeaSmallJpg from '@/assets/images/event-morning-tea-400.jpg'
import eventNdisSessionWebp from '@/assets/images/event-ndis-session.webp'
import eventNdisSessionJpg from '@/assets/images/event-ndis-session.jpg'
import eventNdisSessionSmallWebp from '@/assets/images/event-ndis-session-400.webp'
import eventNdisSessionSmallJpg from '@/assets/images/event-ndis-session-400.jpg'
import eventSportsDayWebp from '@/assets/images/event-sports-day.webp'
import eventSportsDayJpg from '@/assets/images/event-sports-day.jpg'
import eventSportsDaySmallWebp from '@/assets/images/event-sports-day-400.webp'
import eventSportsDaySmallJpg from '@/assets/images/event-sports-day-400.jpg'

const quickAccess: readonly QuickAccessItem[] = [
  {
    id: 'disability-support',
    label: 'Disability Support',
    to: '/services/disability-support-services',
    icon: accessibilityIcon,
  },
  {
    id: 'mental-health',
    label: 'Mental Health',
    to: '/services/mental-health-support',
    icon: brainIcon,
  },
  {
    id: 'carer-resources',
    label: 'Carer Resources',
    to: '/resources',
    icon: heartHandshakeIcon,
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    to: '/volunteer',
    icon: handHelpingIcon,
  },
  {
    id: 'donate',
    label: 'Donate',
    to: '/donate',
    icon: giftIcon,
  },
  {
    id: 'community-events',
    label: 'Community Events',
    to: '/events',
    icon: calendarDaysIcon,
  },
]

const events: readonly EventItem[] = [
  {
    id: 'community-morning-tea',
    dateBadge: '12 AUG',
    title: 'Community Morning Tea',
    description: 'Join us for a relaxed morning tea and meet other members of our community.',
    image: eventMorningTeaWebp,
    imageJpg: eventMorningTeaJpg,
    imageSmall: eventMorningTeaSmallWebp,
    imageSmallJpg: eventMorningTeaSmallJpg,
    imageAlt: 'People gathered together chatting at a community morning tea',
    detailsTo: '/events/community-morning-tea',
  },
  {
    id: 'ndis-info-session',
    dateBadge: '20 AUG',
    title: 'NDIS Info Session',
    description: 'Learn how to navigate your NDIS plan with guidance from our support team.',
    image: eventNdisSessionWebp,
    imageJpg: eventNdisSessionJpg,
    imageSmall: eventNdisSessionSmallWebp,
    imageSmallJpg: eventNdisSessionSmallJpg,
    imageAlt: 'A healthcare professional consulting with a patient during an information session',
    detailsTo: '/events/ndis-info-session',
  },
  {
    id: 'accessible-sports-day',
    dateBadge: '02 SEP',
    title: 'Accessible Sports Day',
    description:
      'A fun, inclusive sports day for participants of all abilities and their families.',
    image: eventSportsDayWebp,
    imageJpg: eventSportsDayJpg,
    imageSmall: eventSportsDaySmallWebp,
    imageSmallJpg: eventSportsDaySmallJpg,
    imageAlt: 'Wheelchair basketball players competing on an outdoor court',
    detailsTo: '/events/accessible-sports-day',
  },
]

export function useHomeContent(): HomeContent {
  const { news: articles } = useCommunityContent()
  const news: readonly NewsItem[] = articles.slice(0, 3).map((article) => ({
    id: article.id,
    publishedOn: article.publishedOn,
    headline: article.headline,
    excerpt: article.excerpt,
    image: article.image,
    imageJpg: article.imageJpg,
    imageSmall: article.imageSmall,
    imageSmallJpg: article.imageSmallJpg,
    imageAlt: article.imageAlt,
    readMoreTo: '/community',
  }))
  return { quickAccess, events, news }
}
