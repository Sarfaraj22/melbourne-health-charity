import type {
  VolunteerBenefit,
  VolunteerContent,
  VolunteerDashboardContent,
  VolunteerEvent,
  VolunteerFaq,
  VolunteerFilterGroup,
  VolunteerImageSet,
  VolunteerOpportunity,
  VolunteerStep,
  VolunteerSubpageLink,
  VolunteerTrainingResource,
} from '@/types/volunteer'

import handHelpingIcon from '@/assets/icons/hand-helping.svg?raw'
import heartHandshakeIcon from '@/assets/icons/heart-handshake.svg?raw'
import clipboardListIcon from '@/assets/icons/clipboard-list.svg?raw'
import usersIcon from '@/assets/icons/users.svg?raw'
import bookOpenIcon from '@/assets/icons/book-open.svg?raw'
import shieldCheckIcon from '@/assets/icons/shield-check.svg?raw'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'
import infoIcon from '@/assets/icons/info.svg?raw'
import userCheckIcon from '@/assets/icons/user-check.svg?raw'
import heartPulseIcon from '@/assets/icons/heart-pulse.svg?raw'

import volunteerHeroWebp from '@/assets/images/volunteer-hero.webp'
import volunteerHeroJpg from '@/assets/images/volunteer-hero.jpg'
import volunteerHeroSmallWebp from '@/assets/images/volunteer-hero-400.webp'
import volunteerHeroSmallJpg from '@/assets/images/volunteer-hero-400.jpg'

import volunteerBecomeWebp from '@/assets/images/volunteer-become.webp'
import volunteerBecomeJpg from '@/assets/images/volunteer-become.jpg'
import volunteerBecomeSmallWebp from '@/assets/images/volunteer-become-400.webp'
import volunteerBecomeSmallJpg from '@/assets/images/volunteer-become-400.jpg'

import volunteerEventFunRunWebp from '@/assets/images/volunteer-event-fun-run.webp'
import volunteerEventFunRunJpg from '@/assets/images/volunteer-event-fun-run.jpg'
import volunteerEventFunRunSmallWebp from '@/assets/images/volunteer-event-fun-run-400.webp'
import volunteerEventFunRunSmallJpg from '@/assets/images/volunteer-event-fun-run-400.jpg'

import volunteerEventTrainingWebp from '@/assets/images/volunteer-event-training.webp'
import volunteerEventTrainingJpg from '@/assets/images/volunteer-event-training.jpg'
import volunteerEventTrainingSmallWebp from '@/assets/images/volunteer-event-training-400.webp'
import volunteerEventTrainingSmallJpg from '@/assets/images/volunteer-event-training-400.jpg'

import volunteerEventGalaWebp from '@/assets/images/volunteer-event-gala.webp'
import volunteerEventGalaJpg from '@/assets/images/volunteer-event-gala.jpg'
import volunteerEventGalaSmallWebp from '@/assets/images/volunteer-event-gala-400.webp'
import volunteerEventGalaSmallJpg from '@/assets/images/volunteer-event-gala-400.jpg'

import volunteerTrainingFirstAidWebp from '@/assets/images/volunteer-training-first-aid.webp'
import volunteerTrainingFirstAidJpg from '@/assets/images/volunteer-training-first-aid.jpg'
import volunteerTrainingFirstAidSmallWebp from '@/assets/images/volunteer-training-first-aid-400.webp'
import volunteerTrainingFirstAidSmallJpg from '@/assets/images/volunteer-training-first-aid-400.jpg'

import volunteerTrainingOnlineWebp from '@/assets/images/volunteer-training-online.webp'
import volunteerTrainingOnlineJpg from '@/assets/images/volunteer-training-online.jpg'
import volunteerTrainingOnlineSmallWebp from '@/assets/images/volunteer-training-online-400.webp'
import volunteerTrainingOnlineSmallJpg from '@/assets/images/volunteer-training-online-400.jpg'

import volunteerTrainingInclusionWebp from '@/assets/images/volunteer-training-inclusion.webp'
import volunteerTrainingInclusionJpg from '@/assets/images/volunteer-training-inclusion.jpg'
import volunteerTrainingInclusionSmallWebp from '@/assets/images/volunteer-training-inclusion-400.webp'
import volunteerTrainingInclusionSmallJpg from '@/assets/images/volunteer-training-inclusion-400.jpg'

const heroImage: VolunteerImageSet = {
  image: volunteerHeroWebp,
  imageJpg: volunteerHeroJpg,
  imageSmall: volunteerHeroSmallWebp,
  imageSmallJpg: volunteerHeroSmallJpg,
  imageAlt: 'Three volunteers wearing yellow charity shirts standing together',
}

const becomeImage: VolunteerImageSet = {
  image: volunteerBecomeWebp,
  imageJpg: volunteerBecomeJpg,
  imageSmall: volunteerBecomeSmallWebp,
  imageSmallJpg: volunteerBecomeSmallJpg,
  imageAlt: 'Volunteers working together on a community cleanup project',
}

const subpageLinks: readonly VolunteerSubpageLink[] = [
  {
    id: 'become-a-volunteer',
    label: 'Become a Volunteer',
    to: '/volunteer/become-a-volunteer',
    icon: handHelpingIcon,
    description: 'Start your volunteering journey with us and support your community.',
  },
  {
    id: 'opportunities',
    label: 'Volunteer Opportunities',
    to: '/volunteer/opportunities',
    icon: clipboardListIcon,
    description: 'Browse available roles and find one that matches your skills.',
  },
  {
    id: 'portal',
    label: 'Volunteer Portal',
    to: '/volunteer/portal',
    icon: usersIcon,
    description: 'Access your personal volunteer dashboard and messages.',
  },
  {
    id: 'faqs',
    label: 'Volunteer FAQs',
    to: '/volunteer/faqs',
    icon: infoIcon,
    description: 'Answers to the questions volunteers ask us most.',
  },
  {
    id: 'training-resources',
    label: 'Training Resources',
    to: '/volunteer/training-resources',
    icon: bookOpenIcon,
    description: 'Learn new skills with our training modules and workshops.',
  },
]

const benefits: readonly VolunteerBenefit[] = [
  {
    id: 'make-a-difference',
    icon: heartHandshakeIcon,
    title: 'Make a Real Difference',
    description:
      'Support people with disability across Melbourne and help build an inclusive community.',
  },
  {
    id: 'build-skills',
    icon: shieldCheckIcon,
    title: 'Build New Skills',
    description: 'Gain free training, recognised certificates, and valuable hands-on experience.',
  },
  {
    id: 'join-community',
    icon: usersIcon,
    title: 'Join a Community',
    description: 'Meet like-minded people, make friends, and feel a sense of belonging.',
  },
  {
    id: 'flexible-commitment',
    icon: calendarDaysIcon,
    title: 'Flexible Commitment',
    description: 'Choose hours that fit around your life, study, or work.',
  },
]

const steps: readonly VolunteerStep[] = [
  {
    id: 'apply',
    title: 'Apply online',
    description: 'Complete our short application form to tell us about you and your interests.',
  },
  {
    id: 'chat',
    title: 'Have a chat',
    description:
      'A coordinator will call you to discuss roles, availability, and any support you need.',
  },
  {
    id: 'train',
    title: 'Complete training',
    description: 'Attend an induction and any role-specific training so you feel confident.',
  },
  {
    id: 'start',
    title: 'Start volunteering',
    description: 'Begin your role, meet your coordinator, and join our volunteer community.',
  },
]

const opportunities: readonly VolunteerOpportunity[] = [
  {
    id: 'event-support-volunteer',
    title: 'Event Support Volunteer',
    description: 'Help set up and run our community events across Melbourne.',
    category: 'event-support',
    categoryLabel: 'Event Support',
    icon: handHelpingIcon,
    commitment: 'Flexible',
  },
  {
    id: 'companionship-visits',
    title: 'Companionship Visits',
    description: 'Provide friendly visits and companionship to isolated participants.',
    category: 'companionship',
    categoryLabel: 'Companionship',
    icon: heartHandshakeIcon,
    commitment: '2 hrs / week',
  },
  {
    id: 'admin-reception-support',
    title: 'Admin & Reception Support',
    description: 'Assist our front-desk team with administrative tasks.',
    category: 'admin',
    categoryLabel: 'Admin Support',
    icon: clipboardListIcon,
    commitment: 'Weekdays',
  },
  {
    id: 'outdoor-cleanups',
    title: 'Beach & Park Clean-ups',
    description: 'Help keep Melbourne\u2019s parks and beaches accessible for everyone.',
    category: 'outdoor',
    categoryLabel: 'Outdoor',
    icon: heartPulseIcon,
    commitment: 'Monthly',
  },
  {
    id: 'peer-mentoring',
    title: 'Peer Mentoring',
    description: 'Support new volunteers as they settle into their roles.',
    category: 'mentoring',
    categoryLabel: 'Mentoring',
    icon: userCheckIcon,
    commitment: 'Ongoing',
  },
]

const filterGroups: readonly VolunteerFilterGroup[] = [
  {
    id: 'categories',
    legend: 'Filter by role type',
    options: [
      { id: 'event-support', label: 'Event Support' },
      { id: 'companionship', label: 'Companionship' },
      { id: 'admin', label: 'Admin Support' },
      { id: 'outdoor', label: 'Outdoor' },
      { id: 'mentoring', label: 'Mentoring' },
    ],
  },
]

const faqs: readonly VolunteerFaq[] = [
  {
    id: 'time-commitment',
    question: 'How much time do I need to commit?',
    answer:
      'It depends on the role. Some opportunities are flexible, while others ask for a regular weekly commitment. You can choose what fits your life.',
  },
  {
    id: 'experience-needed',
    question: 'Do I need experience to volunteer?',
    answer:
      'No. We provide induction and role-specific training so you feel confident, whatever your background.',
  },
  {
    id: 'training-provided',
    question: 'Will I receive training?',
    answer:
      'Yes. Every volunteer completes an induction, and many roles offer further training and recognised certificates.',
  },
  {
    id: 'disability-friendly',
    question: 'Can I volunteer if I have a disability?',
    answer:
      'Absolutely. We welcome volunteers of all abilities and will work with you to find a role and any support you need.',
  },
  {
    id: 'support-available',
    question: 'What support will I get?',
    answer:
      'You will have a dedicated volunteer coordinator to guide you, plus access to training resources and our volunteer community.',
  },
  {
    id: 'how-to-apply',
    question: 'How do I apply?',
    answer:
      'Complete the application form on our Become a Volunteer page. A coordinator will then contact you for a friendly chat.',
  },
]

const trainingResources: readonly VolunteerTrainingResource[] = [
  {
    id: 'first-aid-essentials',
    title: 'First Aid Essentials',
    description: 'Learn CPR and basic first aid so you can respond confidently in an emergency.',
    typeLabel: 'Online module',
    image: volunteerTrainingFirstAidWebp,
    imageJpg: volunteerTrainingFirstAidJpg,
    imageSmall: volunteerTrainingFirstAidSmallWebp,
    imageSmallJpg: volunteerTrainingFirstAidSmallJpg,
    imageAlt: 'People practising CPR on training dummies during a first aid session',
  },
  {
    id: 'online-learning-hub',
    title: 'Online Learning Hub',
    description:
      'Self-paced modules on inclusion, communication, and supporting people with disability.',
    typeLabel: 'Webinar',
    image: volunteerTrainingOnlineWebp,
    imageJpg: volunteerTrainingOnlineJpg,
    imageSmall: volunteerTrainingOnlineSmallWebp,
    imageSmallJpg: volunteerTrainingOnlineSmallJpg,
    imageAlt: 'A laptop and notebook set up for online learning',
  },
  {
    id: 'disability-inclusion-training',
    title: 'Disability Inclusion Training',
    description:
      'Build practical skills to support people with disability and promote genuine inclusion.',
    typeLabel: 'Workshop',
    image: volunteerTrainingInclusionWebp,
    imageJpg: volunteerTrainingInclusionJpg,
    imageSmall: volunteerTrainingInclusionSmallWebp,
    imageSmallJpg: volunteerTrainingInclusionSmallJpg,
    imageAlt: 'A diverse group of people sitting together in a community gathering',
  },
]

const dashboardEvents: readonly VolunteerEvent[] = [
  {
    id: 'community-fun-run',
    dateBadge: '12 SEP 2026',
    title: 'Community Fun Run',
    description: 'Join us for a fully accessible 5km fun run in support of local families.',
    image: volunteerEventFunRunWebp,
    imageJpg: volunteerEventFunRunJpg,
    imageSmall: volunteerEventFunRunSmallWebp,
    imageSmallJpg: volunteerEventFunRunSmallJpg,
    imageAlt: 'A group of people running together along a park path',
  },
  {
    id: 'volunteer-training-day',
    dateBadge: '28 SEP 2026',
    title: 'Volunteer Training Day',
    description: 'Hands-on training session for new and existing volunteers.',
    image: volunteerEventTrainingWebp,
    imageJpg: volunteerEventTrainingJpg,
    imageSmall: volunteerEventTrainingSmallWebp,
    imageSmallJpg: volunteerEventTrainingSmallJpg,
    imageAlt: 'People sitting together and taking notes during a training workshop',
  },
  {
    id: 'fundraising-gala',
    dateBadge: '10 OCT 2026',
    title: 'Fundraising Gala',
    description: 'An evening of celebration to support our accessibility programs.',
    image: volunteerEventGalaWebp,
    imageJpg: volunteerEventGalaJpg,
    imageSmall: volunteerEventGalaSmallWebp,
    imageSmallJpg: volunteerEventGalaSmallJpg,
    imageAlt: 'Guests seated at a formal gala event with a stage',
  },
]

const dashboard: VolunteerDashboardContent = {
  profile: { name: 'Sam Rivera', role: 'Volunteer', initials: 'SR' },
  trainingProgress: { percent: 75 },
  stats: [
    {
      id: 'volunteer-hours',
      label: 'VOLUNTEER HOURS',
      value: '128',
      caption: 'hours this year',
    },
    {
      id: 'certificates',
      label: 'CERTIFICATES',
      value: '5',
      caption: 'earned',
    },
  ],
  events: dashboardEvents,
  opportunities: opportunities.slice(0, 3),
  messages: [
    {
      id: 'coordinator-team',
      sender: 'Coordinator Team',
      preview: 'Reminder: training session confirmed for 28 Sep.',
    },
    {
      id: 'events-team',
      sender: 'Events Team',
      preview: 'Thanks for signing up to the Fun Run - see you there!',
    },
    {
      id: 'system',
      sender: 'System',
      preview: 'Your certificate for First Aid Training is now available.',
    },
  ],
  coordinator: {
    name: 'Sarah Williams',
    role: 'Volunteer Coordinator',
    initials: 'SW',
  },
}

const content: VolunteerContent = {
  heroHeading: 'Volunteer with us',
  heroIntro:
    'Give your time, build your skills, and help create a more inclusive Melbourne for people with disability.',
  portalCtaLabel: 'Go to Volunteer Portal',
  portalCtaTo: '/volunteer/portal',
  subpageLinks,
  benefits,
  becomeIntro:
    'Becoming a volunteer is a rewarding way to give back to your community. Whatever your skills or availability, there is a role for you.',
  becomeImage,
  steps,
  opportunitiesIntro:
    'Explore the roles currently available and find one that matches your interests and schedule.',
  opportunities,
  filterGroups,
  faqsIntro:
    'Here are answers to the questions volunteers ask us most. If you cannot find what you need, contact your coordinator.',
  faqs,
  trainingIntro:
    'We provide free training and resources so every volunteer feels confident and supported.',
  trainingResources,
  dashboard,
}

export function useVolunteerContent(): VolunteerContent {
  return content
}

export { heroImage as volunteerHeroImage }
