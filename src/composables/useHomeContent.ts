import type { HomeContent, NewsItem, QuickAccessItem } from '@/types/home'
import { useCommunityContent } from '@/composables/useCommunityContent'

import accessibilityIcon from '@/assets/icons/accessibility.svg?raw'
import brainIcon from '@/assets/icons/brain.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import handHelpingIcon from '@/assets/icons/hand-helping.svg?raw'
import giftIcon from '@/assets/icons/gift.svg?raw'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'

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
  return { quickAccess, news }
}
