<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventCard from '@/components/events/EventCard.vue'
import EventHero from '@/components/events/EventHero.vue'
import { useEventsContent } from '@/composables/useEventsContent'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Events' }]

const { currentEvents, futureEvents } = useEventsContent()

const heroIntro =
  'Browse our current and upcoming events for people with disability, their families, and carers across Melbourne. Register online to secure your place.'
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Events" :intro="heroIntro" />

    <section aria-labelledby="current-events-heading" class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h2 id="current-events-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
            Current events
          </h2>
          <p class="max-w-2xl text-base text-text-muted">
            Events happening now or coming up soon — register today to save your spot.
          </p>
        </div>
        <ul v-if="currentEvents.length > 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="event in currentEvents" :key="event.slug" class="flex">
            <EventCard :event="event" />
          </li>
        </ul>
        <p v-else class="text-base text-text-muted">
          There are no current events right now. Check back soon.
        </p>
      </div>
    </section>

    <section aria-labelledby="future-events-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h2 id="future-events-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
            Future events
          </h2>
          <p class="max-w-2xl text-base text-text-muted">
            Save the date and register early for these upcoming community events.
          </p>
        </div>
        <ul v-if="futureEvents.length > 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="event in futureEvents" :key="event.slug" class="flex">
            <EventCard :event="event" />
          </li>
        </ul>
        <p v-else class="text-base text-text-muted">No future events are scheduled yet.</p>
      </div>
    </section>
  </div>
</template>
