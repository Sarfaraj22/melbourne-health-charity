import type {
  ResourceFilterGroup,
  ResourceFormat,
  ResourceItem,
  ResourcesContent,
} from '@/types/resource'

import bookOpenIcon from '@/assets/icons/book-open.svg?raw'
import fileTextIcon from '@/assets/icons/file-text.svg?raw'
import videoIcon from '@/assets/icons/video.svg?raw'
import checkCircleIcon from '@/assets/icons/check-circle.svg?raw'

import resourceNdisPlansWebp from '@/assets/images/resource-ndis-plans.webp'
import resourceNdisPlansJpg from '@/assets/images/resource-ndis-plans.jpg'
import resourceNdisPlansSmallWebp from '@/assets/images/resource-ndis-plans-400.webp'
import resourceNdisPlansSmallJpg from '@/assets/images/resource-ndis-plans-400.jpg'

import resourceMentalHealthWebp from '@/assets/images/resource-mental-health.webp'
import resourceMentalHealthJpg from '@/assets/images/resource-mental-health.jpg'
import resourceMentalHealthSmallWebp from '@/assets/images/resource-mental-health-400.webp'
import resourceMentalHealthSmallJpg from '@/assets/images/resource-mental-health-400.jpg'

import resourceCarersWebp from '@/assets/images/resource-carers.webp'
import resourceCarersJpg from '@/assets/images/resource-carers.jpg'
import resourceCarersSmallWebp from '@/assets/images/resource-carers-400.webp'
import resourceCarersSmallJpg from '@/assets/images/resource-carers-400.jpg'

import resourceHomeModificationsWebp from '@/assets/images/resource-home-modifications.webp'
import resourceHomeModificationsJpg from '@/assets/images/resource-home-modifications.jpg'
import resourceHomeModificationsSmallWebp from '@/assets/images/resource-home-modifications-400.webp'
import resourceHomeModificationsSmallJpg from '@/assets/images/resource-home-modifications-400.jpg'

import resourceAuslanWebp from '@/assets/images/resource-auslan.webp'
import resourceAuslanJpg from '@/assets/images/resource-auslan.jpg'
import resourceAuslanSmallWebp from '@/assets/images/resource-auslan-400.webp'
import resourceAuslanSmallJpg from '@/assets/images/resource-auslan-400.jpg'

import resourceEasyReadRightsWebp from '@/assets/images/resource-easy-read-rights.webp'
import resourceEasyReadRightsJpg from '@/assets/images/resource-easy-read-rights.jpg'
import resourceEasyReadRightsSmallWebp from '@/assets/images/resource-easy-read-rights-400.webp'
import resourceEasyReadRightsSmallJpg from '@/assets/images/resource-easy-read-rights-400.jpg'

import resourceSupportCoordinationWebp from '@/assets/images/resource-support-coordination.webp'
import resourceSupportCoordinationJpg from '@/assets/images/resource-support-coordination.jpg'
import resourceSupportCoordinationSmallWebp from '@/assets/images/resource-support-coordination-400.webp'
import resourceSupportCoordinationSmallJpg from '@/assets/images/resource-support-coordination-400.jpg'

import resourcePeerSupportWebp from '@/assets/images/resource-peer-support.webp'
import resourcePeerSupportJpg from '@/assets/images/resource-peer-support.jpg'
import resourcePeerSupportSmallWebp from '@/assets/images/resource-peer-support-400.webp'
import resourcePeerSupportSmallJpg from '@/assets/images/resource-peer-support-400.jpg'

import resourceAccessibleTransportWebp from '@/assets/images/resource-accessible-transport.webp'
import resourceAccessibleTransportJpg from '@/assets/images/resource-accessible-transport.jpg'
import resourceAccessibleTransportSmallWebp from '@/assets/images/resource-accessible-transport-400.webp'
import resourceAccessibleTransportSmallJpg from '@/assets/images/resource-accessible-transport-400.jpg'

import resourceHealthWellbeingWebp from '@/assets/images/resource-health-wellbeing.webp'
import resourceHealthWellbeingJpg from '@/assets/images/resource-health-wellbeing.jpg'
import resourceHealthWellbeingSmallWebp from '@/assets/images/resource-health-wellbeing-400.webp'
import resourceHealthWellbeingSmallJpg from '@/assets/images/resource-health-wellbeing-400.jpg'

import resourceCommunityOutreachWebp from '@/assets/images/resource-community-outreach.webp'
import resourceCommunityOutreachJpg from '@/assets/images/resource-community-outreach.jpg'
import resourceCommunityOutreachSmallWebp from '@/assets/images/resource-community-outreach-400.webp'
import resourceCommunityOutreachSmallJpg from '@/assets/images/resource-community-outreach-400.jpg'

import resourceAdvocacyWebp from '@/assets/images/resource-advocacy.webp'
import resourceAdvocacyJpg from '@/assets/images/resource-advocacy.jpg'
import resourceAdvocacySmallWebp from '@/assets/images/resource-advocacy-400.webp'
import resourceAdvocacySmallJpg from '@/assets/images/resource-advocacy-400.jpg'

const formatIcon: Record<ResourceFormat, string> = {
  guide: bookOpenIcon,
  article: fileTextIcon,
  video: videoIcon,
  'easy-read': checkCircleIcon,
}

const filterGroups: readonly ResourceFilterGroup[] = [
  {
    id: 'topics',
    legend: 'Topics',
    options: [
      { id: 'disability-type', label: 'Disability Type' },
      { id: 'mental-health', label: 'Mental Health' },
      { id: 'carers', label: 'Carers' },
      { id: 'ndis', label: 'NDIS' },
    ],
  },
  {
    id: 'formats',
    legend: 'Formats',
    options: [
      { id: 'videos', label: 'Videos' },
      { id: 'articles', label: 'Articles' },
      { id: 'easy-read', label: 'Easy Read' },
    ],
  },
]

const resources: readonly ResourceItem[] = [
  {
    id: 'understanding-ndis-plans',
    slug: 'understanding-ndis-plans',
    title: 'Understanding NDIS Plans',
    summary: 'A step-by-step guide to navigating your NDIS plan.',
    description:
      'Learn how to read your NDIS plan, understand your budgets, and find providers so you can make the most of your funding.',
    format: 'guide',
    topics: ['ndis', 'disability-type'],
    formats: ['articles'],
    fileUrl: '#download-understanding-ndis-plans',
    icon: formatIcon['guide'],
    images: {
      image: resourceNdisPlansWebp,
      imageJpg: resourceNdisPlansJpg,
      imageSmall: resourceNdisPlansSmallWebp,
      imageSmallJpg: resourceNdisPlansSmallJpg,
      imageAlt: 'A support worker reviewing NDIS documents with a participant',
    },
  },
  {
    id: 'mental-health-support-guide',
    slug: 'mental-health-support-guide',
    title: 'Mental Health Support Guide',
    summary: 'Resources and contacts for mental health support.',
    description:
      'A practical guide to mental health services across Melbourne, including helplines, counselling options, and self-care strategies.',
    format: 'guide',
    topics: ['mental-health'],
    formats: ['articles'],
    fileUrl: '#download-mental-health-support-guide',
    icon: formatIcon['guide'],
    images: {
      image: resourceMentalHealthWebp,
      imageJpg: resourceMentalHealthJpg,
      imageSmall: resourceMentalHealthSmallWebp,
      imageSmallJpg: resourceMentalHealthSmallJpg,
      imageAlt: 'A counsellor in a calm room speaking supportively with a client',
    },
  },
  {
    id: 'caring-for-a-loved-one',
    slug: 'caring-for-a-loved-one',
    title: 'Caring for a Loved One',
    summary: 'Practical tips and support for carers.',
    description:
      'Advice and contacts for family members and carers, covering wellbeing, respite, and navigating the support system.',
    format: 'guide',
    topics: ['carers'],
    formats: ['articles'],
    fileUrl: '#download-caring-for-a-loved-one',
    icon: formatIcon['guide'],
    images: {
      image: resourceCarersWebp,
      imageJpg: resourceCarersJpg,
      imageSmall: resourceCarersSmallWebp,
      imageSmallJpg: resourceCarersSmallJpg,
      imageAlt: 'A carer sharing a warm moment with a family member at home',
    },
  },
  {
    id: 'accessible-home-modifications',
    slug: 'accessible-home-modifications',
    title: 'Accessible Home Modifications',
    summary: 'How to make your home more accessible.',
    description:
      'An overview of common home modifications, funding pathways through the NDIS, and how to get started with an assessment.',
    format: 'article',
    topics: ['disability-type', 'ndis'],
    formats: ['articles'],
    fileUrl: '#download-accessible-home-modifications',
    icon: formatIcon['article'],
    images: {
      image: resourceHomeModificationsWebp,
      imageJpg: resourceHomeModificationsJpg,
      imageSmall: resourceHomeModificationsSmallWebp,
      imageSmallJpg: resourceHomeModificationsSmallJpg,
      imageAlt: 'A ramp and grab bars installed at a welcoming home entrance',
    },
  },
  {
    id: 'introduction-to-auslan',
    slug: 'introduction-to-auslan',
    title: 'Introduction to Auslan',
    summary: 'Video series introducing basic Auslan signs.',
    description:
      'A short video series covering everyday Auslan signs to help you communicate with Deaf and hard-of-hearing community members.',
    format: 'video',
    topics: ['disability-type'],
    formats: ['videos'],
    fileUrl: '#download-introduction-to-auslan',
    icon: formatIcon['video'],
    images: {
      image: resourceAuslanWebp,
      imageJpg: resourceAuslanJpg,
      imageSmall: resourceAuslanSmallWebp,
      imageSmallJpg: resourceAuslanSmallJpg,
      imageAlt: 'A person signing in Auslan during a video lesson',
    },
  },
  {
    id: 'easy-read-your-rights',
    slug: 'easy-read-your-rights',
    title: 'Easy Read: Your Rights',
    summary: 'An easy read guide to your rights and choices.',
    description:
      'Plain-language, easy read information about your rights as a person with disability and the choices available to you.',
    format: 'easy-read',
    topics: ['disability-type'],
    formats: ['easy-read'],
    fileUrl: '#download-easy-read-your-rights',
    icon: formatIcon['easy-read'],
    images: {
      image: resourceEasyReadRightsWebp,
      imageJpg: resourceEasyReadRightsJpg,
      imageSmall: resourceEasyReadRightsSmallWebp,
      imageSmallJpg: resourceEasyReadRightsSmallJpg,
      imageAlt: 'An easy-read booklet with simple icons and short sentences',
    },
  },
  {
    id: 'support-coordination-guide',
    slug: 'support-coordination-guide',
    title: 'Support Coordination Guide',
    summary: 'How support coordination can help you use your plan.',
    description:
      'Understand what support coordinators do, how to choose one, and how they can help you connect with the right services.',
    format: 'guide',
    topics: ['ndis', 'disability-type'],
    formats: ['articles'],
    fileUrl: '#download-support-coordination-guide',
    icon: formatIcon['guide'],
    images: {
      image: resourceSupportCoordinationWebp,
      imageJpg: resourceSupportCoordinationJpg,
      imageSmall: resourceSupportCoordinationSmallWebp,
      imageSmallJpg: resourceSupportCoordinationSmallJpg,
      imageAlt: 'A coordinator and participant planning services together at a desk',
    },
  },
  {
    id: 'peer-support-groups',
    slug: 'peer-support-groups',
    title: 'Peer Support Groups',
    summary: 'Find and join a peer support group near you.',
    description:
      'A directory-style guide to peer support groups across Melbourne for people with disability and their families.',
    format: 'article',
    topics: ['mental-health', 'carers'],
    formats: ['articles'],
    fileUrl: '#download-peer-support-groups',
    icon: formatIcon['article'],
    images: {
      image: resourcePeerSupportWebp,
      imageJpg: resourcePeerSupportJpg,
      imageSmall: resourcePeerSupportSmallWebp,
      imageSmallJpg: resourcePeerSupportSmallJpg,
      imageAlt: 'A small group of people chatting supportively around a table',
    },
  },
  {
    id: 'accessible-transport',
    slug: 'accessible-transport',
    title: 'Accessible Transport Options',
    summary: 'Getting around Melbourne with accessible transport.',
    description:
      'An overview of accessible public transport, community transport schemes, and funding that may help with travel costs.',
    format: 'article',
    topics: ['disability-type', 'ndis'],
    formats: ['articles'],
    fileUrl: '#download-accessible-transport',
    icon: formatIcon['article'],
    images: {
      image: resourceAccessibleTransportWebp,
      imageJpg: resourceAccessibleTransportJpg,
      imageSmall: resourceAccessibleTransportSmallWebp,
      imageSmallJpg: resourceAccessibleTransportSmallJpg,
      imageAlt: 'A low-floor accessible bus at a Melbourne tram stop',
    },
  },
  {
    id: 'health-wellbeing-programs',
    slug: 'health-wellbeing-programs',
    title: 'Health & Wellbeing Programs',
    summary: 'Inclusive fitness and wellness for all abilities.',
    description:
      'A guide to adapted fitness, nutrition, and mindfulness programs designed for people with disability across Melbourne.',
    format: 'video',
    topics: ['mental-health', 'disability-type'],
    formats: ['videos'],
    fileUrl: '#download-health-wellbeing-programs',
    icon: formatIcon['video'],
    images: {
      image: resourceHealthWellbeingWebp,
      imageJpg: resourceHealthWellbeingJpg,
      imageSmall: resourceHealthWellbeingSmallWebp,
      imageSmallJpg: resourceHealthWellbeingSmallJpg,
      imageAlt: 'People taking part in an inclusive group fitness session',
    },
  },
  {
    id: 'community-outreach',
    slug: 'community-outreach',
    title: 'Community Outreach Directory',
    summary: 'Connect with local programs and activities.',
    description:
      'A directory of community outreach programs, social activities, and neighbourhood partnerships across Melbourne.',
    format: 'article',
    topics: ['disability-type', 'carers'],
    formats: ['articles'],
    fileUrl: '#download-community-outreach',
    icon: formatIcon['article'],
    images: {
      image: resourceCommunityOutreachWebp,
      imageJpg: resourceCommunityOutreachJpg,
      imageSmall: resourceCommunityOutreachSmallWebp,
      imageSmallJpg: resourceCommunityOutreachSmallJpg,
      imageAlt: 'A diverse group enjoying a community activity outdoors together',
    },
  },
  {
    id: 'disability-advocacy',
    slug: 'disability-advocacy',
    title: 'Disability Advocacy Know-Your-Rights',
    summary: 'Easy read guide to advocacy and your rights.',
    description:
      'Plain-language information about disability advocacy, self-advocacy, and where to get free or low-cost advocacy support.',
    format: 'easy-read',
    topics: ['disability-type', 'ndis'],
    formats: ['easy-read'],
    fileUrl: '#download-disability-advocacy',
    icon: formatIcon['easy-read'],
    images: {
      image: resourceAdvocacyWebp,
      imageJpg: resourceAdvocacyJpg,
      imageSmall: resourceAdvocacySmallWebp,
      imageSmallJpg: resourceAdvocacySmallJpg,
      imageAlt: 'An advocate speaking alongside a person with disability at a meeting',
    },
  },
]

export function getResourceById(id: string): ResourceItem | undefined {
  return resources.find((resource) => resource.id === id)
}

export function useResourcesContent(): ResourcesContent {
  return { resources, filterGroups }
}
