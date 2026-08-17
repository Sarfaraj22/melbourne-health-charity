<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

interface Props {
  readonly crumbs: readonly BreadcrumbItem[]
  readonly heading: string
}

defineProps<Props>()

interface SubNavLink {
  readonly label: string
  readonly to: string
}

const subNavLinks: readonly SubNavLink[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Appointments', to: '/dashboard/appointments' },
  { label: 'Messages', to: '/dashboard/messages' },
  { label: 'Saved Resources', to: '/dashboard/saved-resources' },
  { label: 'Event Bookings', to: '/dashboard/event-bookings' },
  { label: 'Profile & Settings', to: '/dashboard/profile-settings' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <nav aria-label="Dashboard" class="border-b border-border-default bg-surface px-5 sm:px-8">
      <ul class="mx-auto flex max-w-container flex-wrap items-center gap-x-6 gap-y-2">
        <li v-for="link in subNavLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="text-sm font-medium text-text-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            active-class="text-brand-primary"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </nav>
    <section class="bg-surface px-5 py-10 sm:px-8" aria-labelledby="dashboard-page-heading">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h1 id="dashboard-page-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          {{ heading }}
        </h1>
        <slot />
      </div>
    </section>
  </div>
</template>
