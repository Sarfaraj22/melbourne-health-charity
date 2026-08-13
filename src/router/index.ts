import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const Placeholder = () => import('@/views/PlaceholderView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  { path: '/about', name: 'about', component: Placeholder, meta: { title: 'About Us' } },
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
  { path: '/resources', name: 'resources', component: Placeholder, meta: { title: 'Resources' } },
  {
    path: '/get-support',
    name: 'get-support',
    component: Placeholder,
    meta: { title: 'Get Support' },
  },
  { path: '/volunteer', name: 'volunteer', component: Placeholder, meta: { title: 'Volunteer' } },
  { path: '/donate', name: 'donate', component: Placeholder, meta: { title: 'Donate' } },
  { path: '/events', name: 'events', component: Placeholder, meta: { title: 'Events' } },
  { path: '/community', name: 'community', component: Placeholder, meta: { title: 'Community' } },
  { path: '/contact', name: 'contact', component: Placeholder, meta: { title: 'Contact' } },
  { path: '/login', name: 'login', component: Placeholder, meta: { title: 'Login' } },
  { path: '/legal', name: 'legal', component: Placeholder, meta: { title: 'Legal' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
