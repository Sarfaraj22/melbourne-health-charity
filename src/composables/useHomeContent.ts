import type { EventItem, HomeContent, NewsItem, QuickAccessItem } from '@/types/home'

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
import newsTransportWebp from '@/assets/images/news-transport.webp'
import newsTransportJpg from '@/assets/images/news-transport.jpg'
import newsTransportSmallWebp from '@/assets/images/news-transport-400.webp'
import newsTransportSmallJpg from '@/assets/images/news-transport-400.jpg'
import newsVolunteerWebp from '@/assets/images/news-volunteer.webp'
import newsVolunteerJpg from '@/assets/images/news-volunteer.jpg'
import newsVolunteerSmallWebp from '@/assets/images/news-volunteer-400.webp'
import newsVolunteerSmallJpg from '@/assets/images/news-volunteer-400.jpg'
import newsNdisReviewWebp from '@/assets/images/news-ndis-review.webp'
import newsNdisReviewJpg from '@/assets/images/news-ndis-review.jpg'
import newsNdisReviewSmallWebp from '@/assets/images/news-ndis-review-400.webp'
import newsNdisReviewSmallJpg from '@/assets/images/news-ndis-review-400.jpg'

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
    detailsTo: '/events',
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
    detailsTo: '/events',
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
    detailsTo: '/events',
  },
]

const news: readonly NewsItem[] = [
  {
    id: 'accessible-transport-partnership',
    publishedOn: '15 Jul 2026',
    headline: 'New Accessible Transport Partnership',
    excerpt:
      'We are proud to announce a new partnership improving accessible transport options across Melbourne.',
    image: newsTransportWebp,
    imageJpg: newsTransportJpg,
    imageSmall: newsTransportSmallWebp,
    imageSmallJpg: newsTransportSmallJpg,
    imageAlt: 'A yellow public transit bus parked at a station',
    readMoreTo: '/community',
  },
  {
    id: 'volunteer-of-the-year',
    publishedOn: '02 Jul 2026',
    headline: 'Meet Our 2026 Volunteer of the Year',
    excerpt:
      'Celebrating the incredible dedication of our volunteers supporting the disability community.',
    image: newsVolunteerWebp,
    imageJpg: newsVolunteerJpg,
    imageSmall: newsVolunteerSmallWebp,
    imageSmallJpg: newsVolunteerSmallJpg,
    imageAlt: 'Volunteers standing together beside boxes of donated supplies',
    readMoreTo: '/community',
  },
  {
    id: 'ndis-plan-reviews',
    publishedOn: '20 Jun 2026',
    headline: 'Understanding NDIS Plan Reviews',
    excerpt: 'A simple guide to preparing for your next NDIS plan review with confidence.',
    image: newsNdisReviewWebp,
    imageJpg: newsNdisReviewJpg,
    imageSmall: newsNdisReviewSmallWebp,
    imageSmallJpg: newsNdisReviewSmallJpg,
    imageAlt: 'A person planning and making notes on a laptop at a desk',
    readMoreTo: '/community',
  },
]

export function useHomeContent(): HomeContent {
  return { quickAccess, events, news }
}
