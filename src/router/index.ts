import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const Placeholder = () => import('@/views/PlaceholderView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About Us' },
  },
  {
    path: '/about/our-story',
    name: 'about-story',
    component: () => import('@/views/AboutStoryView.vue'),
    meta: { title: 'Our Story' },
  },
  {
    path: '/about/our-team',
    name: 'about-team',
    component: () => import('@/views/AboutTeamView.vue'),
    meta: { title: 'Our Team' },
  },
  {
    path: '/about/our-mission',
    name: 'about-mission',
    component: () => import('@/views/AboutMissionView.vue'),
    meta: { title: 'Our Mission' },
  },
  {
    path: '/about/partners',
    name: 'about-partners',
    component: () => import('@/views/AboutPartnersView.vue'),
    meta: { title: 'Partners and Sponsors' },
  },
  {
    path: '/about/annual-reports',
    name: 'about-reports',
    component: () => import('@/views/AboutReportsView.vue'),
    meta: { title: 'Annual Reports' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServicesIndexView.vue'),
    meta: { title: 'Services' },
  },
  {
    path: '/services/:categorySlug/:subServiceSlug',
    name: 'service-sub-detail',
    component: () => import('@/views/ServiceDetailView.vue'),
    props: (route) => {
      const categorySlug = route.params['categorySlug']
      const subServiceSlug = route.params['subServiceSlug']
      return {
        categorySlug: typeof categorySlug === 'string' ? categorySlug : '',
        subServiceSlug: typeof subServiceSlug === 'string' ? subServiceSlug : '',
      }
    },
    meta: { title: 'Service Detail' },
  },
  {
    path: '/services/:categorySlug',
    name: 'service-category',
    component: () => import('@/views/ServiceCategoryView.vue'),
    props: (route) => {
      const categorySlug = route.params['categorySlug']
      return { categorySlug: typeof categorySlug === 'string' ? categorySlug : '' }
    },
    meta: { title: 'Service Detail' },
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/views/ResourcesView.vue'),
    meta: { title: 'Resources' },
  },
  {
    path: '/get-support',
    name: 'get-support',
    component: () => import('@/views/GetSupportView.vue'),
    meta: { title: 'Get Support' },
  },
  {
    path: '/get-support/book-appointment',
    name: 'get-support-book',
    component: () => import('@/views/GetSupportBookView.vue'),
    meta: { title: 'Book an Appointment' },
  },
  {
    path: '/get-support/live-chat',
    name: 'get-support-chat',
    component: () => import('@/views/GetSupportChatView.vue'),
    meta: { title: 'Live Chat' },
  },
  {
    path: '/get-support/request-assistance',
    name: 'get-support-assist',
    component: () => import('@/views/GetSupportAssistView.vue'),
    meta: { title: 'Request Assistance' },
  },
  {
    path: '/volunteer',
    name: 'volunteer',
    component: () => import('@/views/VolunteerView.vue'),
    meta: { title: 'Volunteer' },
  },
  {
    path: '/volunteer/become-a-volunteer',
    name: 'volunteer-become',
    component: () => import('@/views/VolunteerBecomeView.vue'),
    meta: { title: 'Become a Volunteer' },
  },
  {
    path: '/volunteer/opportunities',
    name: 'volunteer-opportunities',
    component: () => import('@/views/VolunteerOpportunitiesView.vue'),
    meta: { title: 'Volunteer Opportunities' },
  },
  {
    path: '/volunteer/portal',
    name: 'volunteer-portal',
    component: () => import('@/views/VolunteerPortalView.vue'),
    meta: { title: 'Volunteer Portal' },
  },
  {
    path: '/volunteer/faqs',
    name: 'volunteer-faqs',
    component: () => import('@/views/VolunteerFaqsView.vue'),
    meta: { title: 'Volunteer FAQs' },
  },
  {
    path: '/volunteer/training-resources',
    name: 'volunteer-training',
    component: () => import('@/views/VolunteerTrainingView.vue'),
    meta: { title: 'Training Resources' },
  },
  {
    path: '/donate',
    name: 'donate',
    component: () => import('@/views/DonateView.vue'),
    meta: { title: 'Donate' },
  },
  {
    path: '/donate/make-a-donation',
    name: 'donate-make',
    component: () => import('@/views/DonateMakeView.vue'),
    meta: { title: 'Make a Donation' },
  },
  {
    path: '/donate/fundraising',
    name: 'donate-fundraising',
    component: () => import('@/views/DonateFundraisingView.vue'),
    meta: { title: 'Fundraising Campaigns' },
  },
  {
    path: '/donate/corporate-partnerships',
    name: 'donate-corporate',
    component: () => import('@/views/DonateCorporateView.vue'),
    meta: { title: 'Corporate Partnerships' },
  },
  {
    path: '/donate/faqs',
    name: 'donate-faqs',
    component: () => import('@/views/DonateFaqsView.vue'),
    meta: { title: 'Donation FAQs' },
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/EventsIndexView.vue'),
    meta: { title: 'Events' },
  },
  {
    path: '/events/:eventSlug',
    name: 'event-detail',
    component: () => import('@/views/EventDetailView.vue'),
    props: (route) => {
      const eventSlug = route.params['eventSlug']
      return { eventSlug: typeof eventSlug === 'string' ? eventSlug : '' }
    },
    meta: { title: 'Event Detail' },
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/CommunityView.vue'),
    meta: { title: 'Community' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact' },
  },
  { path: '/login', name: 'login', component: Placeholder, meta: { title: 'Login' } },
  {
    path: '/accessibility-statement',
    name: 'accessibility-statement',
    component: () => import('@/views/LegalDocumentView.vue'),
    props: { slug: 'accessibility-statement' },
    meta: { title: 'Accessibility Statement' },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/views/LegalDocumentView.vue'),
    props: { slug: 'privacy-policy' },
    meta: { title: 'Privacy Policy' },
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: () => import('@/views/LegalDocumentView.vue'),
    props: { slug: 'terms-of-use' },
    meta: { title: 'Terms of Use' },
  },
  {
    path: '/cookie-policy',
    name: 'cookie-policy',
    component: () => import('@/views/LegalDocumentView.vue'),
    props: { slug: 'cookie-policy' },
    meta: { title: 'Cookie Policy' },
  },
  { path: '/legal', redirect: '/privacy-policy' },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
})
