import type { DonateContent } from '@/types/donate'
import giftIcon from '@/assets/icons/gift.svg?raw'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import infoIcon from '@/assets/icons/info.svg?raw'

import donateHeroWebp from '@/assets/images/donate-hero.webp'
import donateHeroJpg from '@/assets/images/donate-hero.jpg'
import donateHeroSmallWebp from '@/assets/images/donate-hero-400.webp'
import donateHeroSmallJpg from '@/assets/images/donate-hero-400.jpg'

import campaignGalaWebp from '@/assets/images/volunteer-event-gala.webp'
import campaignGalaJpg from '@/assets/images/volunteer-event-gala.jpg'
import campaignGalaSmallWebp from '@/assets/images/volunteer-event-gala-400.webp'
import campaignGalaSmallJpg from '@/assets/images/volunteer-event-gala-400.jpg'
import campaignFunRunWebp from '@/assets/images/event-community-fun-run.webp'
import campaignFunRunJpg from '@/assets/images/event-community-fun-run.jpg'
import campaignFunRunSmallWebp from '@/assets/images/event-community-fun-run-400.webp'
import campaignFunRunSmallJpg from '@/assets/images/event-community-fun-run-400.jpg'
import campaignMorningTeaWebp from '@/assets/images/event-morning-tea.webp'
import campaignMorningTeaJpg from '@/assets/images/event-morning-tea.jpg'
import campaignMorningTeaSmallWebp from '@/assets/images/event-morning-tea-400.webp'
import campaignMorningTeaSmallJpg from '@/assets/images/event-morning-tea-400.jpg'

export function useDonateContent(): DonateContent {
  return {
    heroHeading: 'Donate',
    heroIntro:
      'Your gift helps people with disability across Melbourne access support, events, and community programs.',
    heroImage: {
      image: donateHeroWebp,
      imageJpg: donateHeroJpg,
      imageSmall: donateHeroSmallWebp,
      imageSmallJpg: donateHeroSmallJpg,
      imageAlt: 'Hands holding a small plant growing in soil',
    },
    subpageLinks: [
      {
        id: 'make-a-donation',
        label: 'Make a Donation',
        to: '/donate/make-a-donation',
        icon: giftIcon,
        description:
          'Give once or monthly. This form records your request; we do not take card payments on this page.',
      },
      {
        id: 'fundraising',
        label: 'Fundraising Campaigns',
        to: '/donate/fundraising',
        icon: calendarDaysIcon,
        description: 'Join a campaign or start a fundraiser for a program you care about.',
      },
      {
        id: 'corporate',
        label: 'Corporate Partnerships',
        to: '/donate/corporate-partnerships',
        icon: heartHandshakeIcon,
        description:
          'Workplace giving, sponsorships, and in-kind support from Melbourne businesses.',
      },
      {
        id: 'faqs',
        label: 'Donation FAQs',
        to: '/donate/faqs',
        icon: infoIcon,
        description: 'Tax receipts, monthly gifts, and how donations are used.',
      },
    ],
    donateIntro:
      'Choose an amount and how often you would like to give. We will contact you to complete the donation securely.',
    campaignsIntro: 'Current campaigns supporting programs across Melbourne.',
    campaigns: [
      {
        id: 'gala',
        title: 'Inclusion Gala 2026',
        summary: 'Tables and raffle tickets raise funds for peer support groups.',
        ctaLabel: 'Donate to this campaign',
        to: '/donate/make-a-donation',
        images: {
          image: campaignGalaWebp,
          imageJpg: campaignGalaJpg,
          imageSmall: campaignGalaSmallWebp,
          imageSmallJpg: campaignGalaSmallJpg,
          imageAlt: 'Guests gathered at an evening charity event',
        },
      },
      {
        id: 'fun-run',
        title: 'Community Fun Run',
        summary: 'Sponsor a walker or runner on accessible routes this spring.',
        ctaLabel: 'Donate to this campaign',
        to: '/donate/make-a-donation',
        images: {
          image: campaignFunRunWebp,
          imageJpg: campaignFunRunJpg,
          imageSmall: campaignFunRunSmallWebp,
          imageSmallJpg: campaignFunRunSmallJpg,
          imageAlt: 'Runners celebrating as they finish a community fun run',
        },
      },
      {
        id: 'morning-tea',
        title: 'Host a morning tea',
        summary: 'Raise funds with friends while we supply Easy Read host kits.',
        ctaLabel: 'Donate to this campaign',
        to: '/donate/make-a-donation',
        images: {
          image: campaignMorningTeaWebp,
          imageJpg: campaignMorningTeaJpg,
          imageSmall: campaignMorningTeaSmallWebp,
          imageSmallJpg: campaignMorningTeaSmallJpg,
          imageAlt: 'People gathered together chatting at a community morning tea',
        },
      },
    ],
    corporateIntro:
      'Businesses can support inclusive employment, event sponsorship, or matched workplace giving.',
    corporatePoints: [
      'Sponsor an accessible community event.',
      'Offer work experience or employment pathways.',
      'Match staff donations or volunteer days.',
    ],
    faqsIntro: 'Common questions about giving to Melbourne Disability Support Charity.',
    faqs: [
      {
        id: 'tax',
        question: 'Are donations tax deductible?',
        answer:
          'Yes. We are a registered charity. We issue receipts for gifts of $2 or more once the donation is completed.',
      },
      {
        id: 'monthly',
        question: 'Can I give monthly?',
        answer:
          'Yes. Choose monthly on the donation form and we will arrange a regular gift with you.',
      },
      {
        id: 'used',
        question: 'How are donations used?',
        answer:
          'Gifts support programs, accessible events, and support coordination for people who cannot cover full fees.',
      },
    ],
  }
}
