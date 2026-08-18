<script setup lang="ts">
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useUserDashboardData } from '@/composables/useUserDashboardData'

const { eventBookings } = useUserDashboardData()
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="dashboard-events-heading">
    <div class="mx-auto flex max-w-container flex-col gap-5">
      <h2 id="dashboard-events-heading" class="text-2xl font-bold text-text-default">
        Upcoming Events
      </h2>

      <p v-if="eventBookings.length === 0" class="text-base text-text-muted">
        You have not registered for any events yet.
        <router-link
          to="/events"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Browse events
        </router-link>
      </p>
      <ul v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="event in eventBookings"
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
          <h3 class="text-base font-bold text-text-default">{{ event.title }}</h3>
          <p class="text-sm text-text-muted">{{ event.summary }}</p>
          <router-link
            :to="event.href"
            class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Learn more
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
