import type { EventDetail, EventsContent } from '@/types/event'

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
import eventWellbeingRetreatWebp from '@/assets/images/event-wellbeing-retreat.webp'
import eventWellbeingRetreatJpg from '@/assets/images/event-wellbeing-retreat.jpg'
import eventWellbeingRetreatSmallWebp from '@/assets/images/event-wellbeing-retreat-400.webp'
import eventWellbeingRetreatSmallJpg from '@/assets/images/event-wellbeing-retreat-400.jpg'
import eventArtsWorkshopWebp from '@/assets/images/event-arts-workshop.webp'
import eventArtsWorkshopJpg from '@/assets/images/event-arts-workshop.jpg'
import eventArtsWorkshopSmallWebp from '@/assets/images/event-arts-workshop-400.webp'
import eventArtsWorkshopSmallJpg from '@/assets/images/event-arts-workshop-400.jpg'
import eventCommunityFunRunWebp from '@/assets/images/event-community-fun-run.webp'
import eventCommunityFunRunJpg from '@/assets/images/event-community-fun-run.jpg'
import eventCommunityFunRunSmallWebp from '@/assets/images/event-community-fun-run-400.webp'
import eventCommunityFunRunSmallJpg from '@/assets/images/event-community-fun-run-400.jpg'

const events: readonly EventDetail[] = [
  {
    slug: 'community-morning-tea',
    title: 'Community Morning Tea',
    summary: 'Join us for a relaxed morning tea and meet other members of our community.',
    description:
      'Our Community Morning Tea is a welcoming, informal gathering for people with disability, their families, and carers across Melbourne. Come along to share a cuppa, make new connections, learn about our services, and help shape the programs that matter to you. Auslan interpretation and wheelchair-accessible venues are provided at every session.',
    date: '2026-08-12',
    dateBadge: '12 AUG',
    time: '10:00am - 11:30am',
    location: '123 Example Street, Melbourne VIC 3000',
    cost: 'Free — light refreshments provided',
    status: 'current',
    images: {
      image: eventMorningTeaWebp,
      imageJpg: eventMorningTeaJpg,
      imageSmall: eventMorningTeaSmallWebp,
      imageSmallJpg: eventMorningTeaSmallJpg,
      imageAlt: 'People gathered together chatting at a community morning tea',
    },
    registrationOpen: true,
  },
  {
    slug: 'ndis-info-session',
    title: 'NDIS Info Session',
    summary: 'Learn how to navigate your NDIS plan with guidance from our support team.',
    description:
      'This NDIS Info Session walks you through understanding your plan, making the most of your funding, and preparing for plan reviews. Our experienced support coordinators will be on hand to answer questions, and there will be dedicated time for one-on-one follow-ups. Family members and carers are welcome to attend.',
    date: '2026-08-20',
    dateBadge: '20 AUG',
    time: '1:00pm - 3:00pm',
    location: '123 Example Street, Melbourne VIC 3000; livestream available statewide',
    cost: 'Free',
    status: 'current',
    images: {
      image: eventNdisSessionWebp,
      imageJpg: eventNdisSessionJpg,
      imageSmall: eventNdisSessionSmallWebp,
      imageSmallJpg: eventNdisSessionSmallJpg,
      imageAlt: 'A healthcare professional consulting with a patient during an information session',
    },
    registrationOpen: true,
  },
  {
    slug: 'accessible-sports-day',
    title: 'Accessible Sports Day',
    summary: 'A fun, inclusive sports day for participants of all abilities and their families.',
    description:
      'Our Accessible Sports Day offers adapted sports and activities — from wheelchair basketball and boccia to sensory-friendly games — for participants of all abilities and their families. No experience is needed, and all equipment is provided. Volunteers and support workers will be on site to assist throughout the day.',
    date: '2026-09-02',
    dateBadge: '02 SEP',
    time: '9:30am - 1:00pm',
    location: 'Royal Park, Parkville VIC 3052',
    cost: 'Free — sausage sizzle included',
    status: 'current',
    images: {
      image: eventSportsDayWebp,
      imageJpg: eventSportsDayJpg,
      imageSmall: eventSportsDaySmallWebp,
      imageSmallJpg: eventSportsDaySmallJpg,
      imageAlt: 'Wheelchair basketball players competing on an outdoor court',
    },
    registrationOpen: true,
  },
  {
    slug: 'carers-wellbeing-retreat',
    title: 'Carers Wellbeing Retreat',
    summary: 'A restorative day of mindfulness, gentle movement, and peer connection for carers.',
    description:
      'Dedicated to the wellbeing of carers, this retreat offers guided mindfulness, gentle movement, and time to connect with others who understand the caring journey. Lunch and quiet spaces are provided, and respite support can be arranged on request so you can attend with peace of mind.',
    date: '2026-10-15',
    dateBadge: '15 OCT',
    time: '9:00am - 3:00pm',
    location: 'Dandenong Ranges, VIC (transport from Melbourne available)',
    cost: 'Free for registered carers — lunch provided',
    status: 'future',
    images: {
      image: eventWellbeingRetreatWebp,
      imageJpg: eventWellbeingRetreatJpg,
      imageSmall: eventWellbeingRetreatSmallWebp,
      imageSmallJpg: eventWellbeingRetreatSmallJpg,
      imageAlt: 'A tranquil outdoor wellness retreat surrounded by nature',
    },
    registrationOpen: true,
  },
  {
    slug: 'accessible-arts-workshop',
    title: 'Accessible Arts Workshop',
    summary: 'An inclusive, hands-on art workshop for people with disability of all skill levels.',
    description:
      'Explore your creativity in a supportive, fully accessible studio. Our Accessible Arts Workshop is led by an inclusive-art facilitator and includes adapted tools, sensory-friendly pacing, and one-on-one support. All materials are supplied, and participants take home their own finished piece.',
    date: '2026-11-08',
    dateBadge: '08 NOV',
    time: '11:00am - 1:30pm',
    location: '123 Example Street, Melbourne VIC 3000',
    cost: 'Free — all materials provided',
    status: 'future',
    images: {
      image: eventArtsWorkshopWebp,
      imageJpg: eventArtsWorkshopJpg,
      imageSmall: eventArtsWorkshopSmallWebp,
      imageSmallJpg: eventArtsWorkshopSmallJpg,
      imageAlt: 'People painting together at a table in an inclusive art workshop',
    },
    registrationOpen: true,
  },
  {
    slug: 'community-fun-run',
    title: 'Community Fun Run',
    summary: 'An inclusive community fun run and walk with accessible routes for all abilities.',
    description:
      'Join us for a community fun run and walk through scenic parkland, with 1km, 3km, and 5km accessible routes designed for wheelchair users, families, and runners of all abilities. Every finisher receives a medal, and proceeds support our disability programs across Melbourne.',
    date: '2026-12-05',
    dateBadge: '05 DEC',
    time: '8:00am - 11:00am',
    location: 'Birrarung Marr, Melbourne VIC 3000',
    cost: 'Free to register — donations welcome',
    status: 'future',
    images: {
      image: eventCommunityFunRunWebp,
      imageJpg: eventCommunityFunRunJpg,
      imageSmall: eventCommunityFunRunSmallWebp,
      imageSmallJpg: eventCommunityFunRunSmallJpg,
      imageAlt: 'Runners celebrating as they finish a community fun run',
    },
    registrationOpen: true,
  },
]

export function getEventBySlug(slug: string): EventDetail | undefined {
  return events.find((event) => event.slug === slug)
}

export function getCurrentEvents(): readonly EventDetail[] {
  return events.filter((event) => event.status === 'current')
}

export function getFutureEvents(): readonly EventDetail[] {
  return events.filter((event) => event.status === 'future')
}

export function useEventsContent(): EventsContent {
  return {
    events,
    currentEvents: getCurrentEvents(),
    futureEvents: getFutureEvents(),
  }
}
