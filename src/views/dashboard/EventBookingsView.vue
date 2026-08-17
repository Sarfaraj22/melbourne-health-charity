<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const events = content.upcomingEvents

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Event Bookings' },
]
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Event Bookings">
    <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="event in events"
        :key="event.id"
        class="flex flex-col gap-2 rounded-md border border-border-default bg-surface p-4"
      >
        <div class="overflow-hidden rounded-md">
          <ResponsiveImage
            :image="event.images.image"
            :image-jpg="event.images.imageJpg"
            :image-small="event.images.imageSmall"
            :image-small-jpg="event.images.imageSmallJpg"
            :alt="event.images.imageAlt"
            class-name="h-full w-full object-cover"
            picture-class-name="block aspect-video w-full"
          />
        </div>
        <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">
          {{ event.dateBadge }}
        </p>
        <h2 class="text-base font-bold text-text-default">{{ event.title }}</h2>
        <p class="text-sm text-text-muted">{{ event.summary }}</p>
        <router-link
          :to="event.href"
          class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          View event
        </router-link>
      </li>
    </ul>
  </DashboardLayout>
</template>
