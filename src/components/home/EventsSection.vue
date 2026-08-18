<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useEventsContent } from '@/composables/useEventsContent'
import type { EventItem } from '@/types/home'

const { events, loading } = useEventsContent()

const homeEvents = computed((): readonly EventItem[] =>
  events.value
    .filter((event) => event.status !== 'past')
    .slice(0, 3)
    .map((event) => ({
      id: event.slug,
      dateBadge: event.dateBadge,
      title: event.title,
      description: event.summary,
      image: event.images.image,
      imageJpg: event.images.imageJpg,
      imageSmall: event.images.imageSmall,
      imageSmallJpg: event.images.imageSmallJpg,
      imageAlt: event.images.imageAlt,
      detailsTo: `/events/${event.slug}`,
    })),
)
</script>

<template>
  <section aria-labelledby="events-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 id="events-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Upcoming Events
        </h2>
        <router-link
          to="/events"
          class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          View all events →
        </router-link>
      </div>
      <p v-if="loading" class="text-base text-text-muted">Loading events…</p>
      <p v-else-if="homeEvents.length === 0" class="text-base text-text-muted">
        There are no upcoming events right now. Check back soon.
      </p>
      <ul v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="event in homeEvents" :key="event.id">
          <BaseCard interactive>
            <ResponsiveImage
              :image="event.image"
              :image-jpg="event.imageJpg"
              :image-small="event.imageSmall"
              :image-small-jpg="event.imageSmallJpg"
              :alt="event.imageAlt"
              class-name="mb-2 h-36 w-full rounded object-cover"
            />
            <span
              class="inline-block w-fit rounded border border-brand-primary px-2.5 py-1 text-xs font-bold text-brand-primary"
            >
              {{ event.dateBadge }}
            </span>
            <h3 class="text-base font-bold text-text-default">{{ event.title }}</h3>
            <p class="text-sm text-text-muted">{{ event.description }}</p>
            <router-link
              :to="event.detailsTo"
              class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              View details
            </router-link>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
