import type { AboutContent } from '@/types/about'
import bookOpenIcon from '@/assets/icons/book-open.svg?raw'
import usersIcon from '@/assets/icons/users.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import shieldCheckIcon from '@/assets/icons/shield-check.svg?raw'
import fileTextIcon from '@/assets/icons/file-text.svg?raw'

import aboutHeroWebp from '@/assets/images/about-hero.webp'
import aboutHeroJpg from '@/assets/images/about-hero.jpg'
import aboutHeroSmallWebp from '@/assets/images/about-hero-400.webp'
import aboutHeroSmallJpg from '@/assets/images/about-hero-400.jpg'

export function useAboutContent(): AboutContent {
  return {
    heroHeading: 'About us',
    heroIntro:
      'We are a Melbourne charity supporting people with disability, families, and carers with practical services, advocacy, and community.',
    heroImage: {
      image: aboutHeroWebp,
      imageJpg: aboutHeroJpg,
      imageSmall: aboutHeroSmallWebp,
      imageSmallJpg: aboutHeroSmallJpg,
      imageAlt: 'Two colleagues talking together during a meeting',
    },
    missionBlurb:
      'Our mission is an inclusive Melbourne where people with disability can live, work, and belong with the right supports.',
    subpageLinks: [
      {
        id: 'our-story',
        label: 'Our Story',
        to: '/about/our-story',
        icon: bookOpenIcon,
        description: 'How we started and how we grew with the Melbourne disability community.',
      },
      {
        id: 'our-team',
        label: 'Our Team',
        to: '/about/our-team',
        icon: usersIcon,
        description: 'Meet the people who run our programs, support coordination, and volunteers.',
      },
      {
        id: 'our-mission',
        label: 'Our Mission',
        to: '/about/our-mission',
        icon: shieldCheckIcon,
        description: 'The values that guide every service, event, and partnership.',
      },
      {
        id: 'partners',
        label: 'Partners & Sponsors',
        to: '/about/partners',
        icon: heartHandshakeIcon,
        description: 'Organisations who help us deliver programs across greater Melbourne.',
      },
      {
        id: 'annual-reports',
        label: 'Annual Reports',
        to: '/about/annual-reports',
        icon: fileTextIcon,
        description: 'Read how donations and grants were used each year.',
      },
    ],
    storyIntro:
      'We began as a small peer-support group in the inner north and grew into an NDIS-registered charity serving people across Melbourne.',
    milestones: [
      {
        id: '2014',
        year: '2014',
        title: 'Peer groups begin',
        description: 'Families and people with disability started meeting monthly in Brunswick.',
      },
      {
        id: '2018',
        year: '2018',
        title: 'Registered charity',
        description: 'We registered as a charity and opened our first Melbourne office.',
      },
      {
        id: '2022',
        year: '2022',
        title: 'NDIS registration',
        description: 'Support coordination and community outreach expanded across the suburbs.',
      },
      {
        id: '2026',
        year: '2026',
        title: 'City hub opens',
        description: 'A drop-in hub in Melbourne CBD added Easy Read help and social programs.',
      },
    ],
    teamIntro: 'A small team of support coordinators, allied health staff, and community workers.',
    team: [
      {
        id: 'aisha',
        name: 'Aisha Rahman',
        role: 'Chief Executive Officer',
        initials: 'AR',
        bio: 'Aisha has worked in disability advocacy in Victoria for 15 years.',
      },
      {
        id: 'tom',
        name: 'Tom Nguyen',
        role: 'Head of Support Coordination',
        initials: 'TN',
        bio: 'Tom leads our NDIS coordination team and carer workshops.',
      },
      {
        id: 'elena',
        name: 'Elena Papadopoulos',
        role: 'Community Programs Manager',
        initials: 'EP',
        bio: 'Elena designs inclusive events and peer groups across Melbourne.',
      },
      {
        id: 'james',
        name: 'James Okonkwo',
        role: 'Volunteer Coordinator',
        initials: 'JO',
        bio: 'James trains and supports our volunteer community.',
      },
    ],
    missionStatement:
      'We exist so people with disability in Melbourne can access supports, take part in community life, and have their rights respected.',
    values: [
      {
        id: 'inclusion',
        title: 'Inclusion',
        description: 'Programs are designed with people with disability, not for them.',
      },
      {
        id: 'respect',
        title: 'Respect',
        description: 'We listen first and adapt communication, venues, and timing.',
      },
      {
        id: 'practical',
        title: 'Practical help',
        description: 'We focus on appointments, plans, transport, and everyday supports.',
      },
    ],
    partnersIntro:
      'We work with councils, health services, and community groups. Names below are illustrative for this site.',
    partners: [
      {
        id: 'inner-north',
        name: 'Inner North Community Health',
        description: 'Joint mental health and wellbeing clinics.',
      },
      {
        id: 'west-council',
        name: 'Western Melbourne Councils',
        description: 'Accessible events and outreach in the west.',
      },
      {
        id: 'allied-network',
        name: 'Allied Health Network Victoria',
        description: 'Occupational therapy and physiotherapy pathways.',
      },
    ],
    reportsIntro: 'Annual reports summarise programs, volunteering, and how funds were used.',
    reports: [
      {
        id: '2025',
        title: 'Annual Report 2025',
        year: '2025',
        summary: 'Services, events, and finances for the 2024–25 year.',
        fileUrl: '#download-annual-report-2025',
      },
      {
        id: '2024',
        title: 'Annual Report 2024',
        year: '2024',
        summary: 'Growth of support coordination and volunteer programs.',
        fileUrl: '#download-annual-report-2024',
      },
    ],
  }
}
