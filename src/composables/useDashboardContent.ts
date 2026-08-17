import type { DashboardContent } from '@/types/dashboard'

import eventCommunityFunRunWebp from '@/assets/images/event-community-fun-run.webp'
import eventCommunityFunRunJpg from '@/assets/images/event-community-fun-run.jpg'
import eventCommunityFunRunSmallWebp from '@/assets/images/event-community-fun-run-400.webp'
import eventCommunityFunRunSmallJpg from '@/assets/images/event-community-fun-run-400.jpg'

import eventWellbeingRetreatWebp from '@/assets/images/event-wellbeing-retreat.webp'
import eventWellbeingRetreatJpg from '@/assets/images/event-wellbeing-retreat.jpg'
import eventWellbeingRetreatSmallWebp from '@/assets/images/event-wellbeing-retreat-400.webp'
import eventWellbeingRetreatSmallJpg from '@/assets/images/event-wellbeing-retreat-400.jpg'

import volunteerEventGalaWebp from '@/assets/images/volunteer-event-gala.webp'
import volunteerEventGalaJpg from '@/assets/images/volunteer-event-gala.jpg'
import volunteerEventGalaSmallWebp from '@/assets/images/volunteer-event-gala-400.webp'
import volunteerEventGalaSmallJpg from '@/assets/images/volunteer-event-gala-400.jpg'

export interface UseDashboardContentReturn {
  readonly content: DashboardContent
}

const dashboardContent: DashboardContent = {
  greetingSubtitle: "Here's what's happening with your account today.",
  upcomingAppointment: {
    id: 'appointment-1',
    service: 'Occupational Therapy',
    date: '15 Aug 2026',
    time: '10:30am',
    location: '123 Example Street, Melbourne',
  },
  messages: [
    {
      id: 'message-1',
      sender: 'Dr. Patel',
      preview: 'Your next session is confirmed for 15 Aug.',
      receivedAt: 'Yesterday',
    },
    {
      id: 'message-2',
      sender: 'Support Team',
      preview: 'We have updated your NDIS plan details.',
      receivedAt: '2 days ago',
    },
    {
      id: 'message-3',
      sender: 'Reminder',
      preview: 'Please complete your feedback survey.',
      receivedAt: '4 days ago',
    },
  ],
  savedResources: [
    {
      id: 'resource-1',
      title: 'Understanding NDIS Plans',
      kind: 'guide',
      href: '/resources',
    },
    {
      id: 'resource-2',
      title: 'Mental Health Support Guide',
      kind: 'guide',
      href: '/resources',
    },
    {
      id: 'resource-3',
      title: 'Introduction to Auslan',
      kind: 'video',
      href: '/resources',
    },
  ],
  upcomingEvents: [
    {
      id: 'event-1',
      dateBadge: '12 SEP 2026',
      title: 'Community Fun Run',
      summary: 'A fully accessible 5km fun run in support of local families.',
      images: {
        image: eventCommunityFunRunWebp,
        imageJpg: eventCommunityFunRunJpg,
        imageSmall: eventCommunityFunRunSmallWebp,
        imageSmallJpg: eventCommunityFunRunSmallJpg,
        imageAlt: 'Participants at a community fun run event',
      },
      href: '/events/community-fun-run',
    },
    {
      id: 'event-2',
      dateBadge: '28 SEP 2026',
      title: 'Peer Support Group',
      summary: 'Monthly peer support meet-up for participants and carers.',
      images: {
        image: eventWellbeingRetreatWebp,
        imageJpg: eventWellbeingRetreatJpg,
        imageSmall: eventWellbeingRetreatSmallWebp,
        imageSmallJpg: eventWellbeingRetreatSmallJpg,
        imageAlt: 'People gathered at a wellbeing retreat peer support session',
      },
      href: '/events/peer-support-group',
    },
    {
      id: 'event-3',
      dateBadge: '10 OCT 2026',
      title: 'Fundraising Gala',
      summary: 'An evening of celebration to support our accessibility programs.',
      images: {
        image: volunteerEventGalaWebp,
        imageJpg: volunteerEventGalaJpg,
        imageSmall: volunteerEventGalaSmallWebp,
        imageSmallJpg: volunteerEventGalaSmallJpg,
        imageAlt: 'Guests at a fundraising gala evening',
      },
      href: '/events/fundraising-gala',
    },
  ],
  settingsRows: [
    {
      id: 'settings-1',
      label: 'Accessibility Settings',
      value: 'Manage',
      to: '/dashboard/profile-settings',
    },
    {
      id: 'settings-2',
      label: 'Privacy & Security',
      value: 'Manage',
      to: '/dashboard/profile-settings',
    },
    { id: 'settings-3', label: 'Text Size', value: 'Medium', to: '/dashboard/profile-settings' },
    { id: 'settings-4', label: 'Language', value: 'English', to: '/dashboard/profile-settings' },
  ],
}

export function useDashboardContent(): UseDashboardContentReturn {
  return { content: dashboardContent }
}
