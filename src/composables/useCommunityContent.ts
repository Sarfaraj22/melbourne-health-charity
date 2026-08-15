import type {
  CommunityContent,
  CommunitySocialChannel,
  NewsArticle,
  SuccessStory,
  Testimonial,
} from '@/types/community'

import facebookIcon from '@/assets/icons/facebook.svg?raw'
import twitterIcon from '@/assets/icons/twitter.svg?raw'
import instagramIcon from '@/assets/icons/instagram.svg?raw'
import linkedinIcon from '@/assets/icons/linkedin.svg?raw'

import communityHeroWebp from '@/assets/images/community-hero.webp'
import communityHeroJpg from '@/assets/images/community-hero.jpg'
import communityHeroSmallWebp from '@/assets/images/community-hero-400.webp'
import communityHeroSmallJpg from '@/assets/images/community-hero-400.jpg'

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
import newsPeerGroupsWebp from '@/assets/images/news-peer-groups.webp'
import newsPeerGroupsJpg from '@/assets/images/news-peer-groups.jpg'
import newsPeerGroupsSmallWebp from '@/assets/images/news-peer-groups-400.webp'
import newsPeerGroupsSmallJpg from '@/assets/images/news-peer-groups-400.jpg'
import newsMelbourneHubWebp from '@/assets/images/news-melbourne-hub.webp'
import newsMelbourneHubJpg from '@/assets/images/news-melbourne-hub.jpg'
import newsMelbourneHubSmallWebp from '@/assets/images/news-melbourne-hub-400.webp'
import newsMelbourneHubSmallJpg from '@/assets/images/news-melbourne-hub-400.jpg'
import newsEasyReadWebp from '@/assets/images/news-easy-read.webp'
import newsEasyReadJpg from '@/assets/images/news-easy-read.jpg'
import newsEasyReadSmallWebp from '@/assets/images/news-easy-read-400.webp'
import newsEasyReadSmallJpg from '@/assets/images/news-easy-read-400.jpg'

import storyIndependentWebp from '@/assets/images/story-independent-living.webp'
import storyIndependentJpg from '@/assets/images/story-independent-living.jpg'
import storyIndependentSmallWebp from '@/assets/images/story-independent-living-400.webp'
import storyIndependentSmallJpg from '@/assets/images/story-independent-living-400.jpg'
import storyEmploymentWebp from '@/assets/images/story-employment.webp'
import storyEmploymentJpg from '@/assets/images/story-employment.jpg'
import storyEmploymentSmallWebp from '@/assets/images/story-employment-400.webp'
import storyEmploymentSmallJpg from '@/assets/images/story-employment-400.jpg'
import storyPeerMentorWebp from '@/assets/images/story-peer-mentor.webp'
import storyPeerMentorJpg from '@/assets/images/story-peer-mentor.jpg'
import storyPeerMentorSmallWebp from '@/assets/images/story-peer-mentor-400.webp'
import storyPeerMentorSmallJpg from '@/assets/images/story-peer-mentor-400.jpg'

const news: readonly NewsArticle[] = [
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
  },
  {
    id: 'peer-support-groups',
    publishedOn: '05 Jun 2026',
    headline: 'New Peer Support Groups Across Melbourne',
    excerpt:
      'Weekly peer groups are now running in Footscray, Preston, and Dandenong for people with disability and carers.',
    image: newsPeerGroupsWebp,
    imageJpg: newsPeerGroupsJpg,
    imageSmall: newsPeerGroupsSmallWebp,
    imageSmallJpg: newsPeerGroupsSmallJpg,
    imageAlt: 'Two colleagues talking together during a workplace conversation',
  },
  {
    id: 'melbourne-community-hub',
    publishedOn: '22 May 2026',
    headline: 'Community Hub Opens in Melbourne CBD',
    excerpt:
      'Our new drop-in hub offers a quiet space, NDIS help, and social activities in the heart of the city.',
    image: newsMelbourneHubWebp,
    imageJpg: newsMelbourneHubJpg,
    imageSmall: newsMelbourneHubSmallWebp,
    imageSmallJpg: newsMelbourneHubSmallJpg,
    imageAlt: 'City skyline at dusk with lights reflecting on the water',
  },
  {
    id: 'easy-read-ndis-updates',
    publishedOn: '08 May 2026',
    headline: 'Easy Read NDIS Updates Now Available',
    excerpt:
      'We have published Easy Read summaries of recent NDIS changes so everyone can follow what is happening.',
    image: newsEasyReadWebp,
    imageJpg: newsEasyReadJpg,
    imageSmall: newsEasyReadSmallWebp,
    imageSmallJpg: newsEasyReadSmallJpg,
    imageAlt: 'A person writing notes in a notebook at a desk',
  },
]

const stories: readonly SuccessStory[] = [
  {
    id: 'jordan-independent-living',
    title: 'Finding a home that works for me',
    name: 'Jordan, Brunswick',
    summary:
      'With support coordination and home modifications, Jordan moved into an accessible apartment and now hosts friends for weekly game nights.',
    images: {
      image: storyIndependentWebp,
      imageJpg: storyIndependentJpg,
      imageSmall: storyIndependentSmallWebp,
      imageSmallJpg: storyIndependentSmallJpg,
      imageAlt: 'A person stretching on a yoga mat during an exercise session',
    },
  },
  {
    id: 'priya-employment',
    title: 'Starting work with the right supports',
    name: 'Priya, Footscray',
    summary:
      'Priya joined our employment pathway program and now works three days a week in an office role she loves, with workplace adjustments in place.',
    images: {
      image: storyEmploymentWebp,
      imageJpg: storyEmploymentJpg,
      imageSmall: storyEmploymentSmallWebp,
      imageSmallJpg: storyEmploymentSmallJpg,
      imageAlt: 'A professional smiling during a conversation at work',
    },
  },
  {
    id: 'marcus-peer-mentor',
    title: 'Giving back as a peer mentor',
    name: 'Marcus, Preston',
    summary:
      'After years of using our mental health programs, Marcus trained as a peer mentor and now supports others starting their NDIS journey.',
    images: {
      image: storyPeerMentorWebp,
      imageJpg: storyPeerMentorJpg,
      imageSmall: storyPeerMentorSmallWebp,
      imageSmallJpg: storyPeerMentorSmallJpg,
      imageAlt: 'A group of colleagues collaborating around a table',
    },
  },
]

const testimonials: readonly Testimonial[] = [
  {
    id: 'amira',
    quote:
      'The team explained my NDIS plan in a way I could understand. I finally feel in control of my supports.',
    name: 'Amira',
    role: 'NDIS participant, Sunshine',
  },
  {
    id: 'david',
    quote:
      'As a carer, the peer group gave me practical tips and people who actually get what our family is going through.',
    name: 'David',
    role: 'Family carer, Glen Waverley',
  },
  {
    id: 'lina',
    quote:
      'Volunteering here showed me how small acts of welcome change someone’s whole week. I am proud to be part of this community.',
    name: 'Lina',
    role: 'Volunteer, Melbourne',
  },
]

const socialChannels: readonly CommunitySocialChannel[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Event photos, Easy Read updates, and community notices.',
    icon: facebookIcon,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    description: 'Short news, service alerts, and advocacy campaigns.',
    icon: twitterIcon,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Stories from programs, volunteers, and everyday inclusion.',
    icon: instagramIcon,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Partnerships, jobs, and news for supporters and employers.',
    icon: linkedinIcon,
  },
]

export function useCommunityContent(): CommunityContent {
  return {
    heroHeading: 'Community news and stories',
    heroIntro:
      'Read the latest news, success stories, and messages from people with disability, families, and volunteers across Melbourne.',
    heroImage: {
      image: communityHeroWebp,
      imageJpg: communityHeroJpg,
      imageSmall: communityHeroSmallWebp,
      imageSmallJpg: communityHeroSmallJpg,
      imageAlt: 'A diverse group of friends sitting together outdoors and talking',
    },
    news,
    stories,
    testimonials,
    socialChannels,
  }
}
