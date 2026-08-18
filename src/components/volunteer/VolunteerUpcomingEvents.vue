<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useVolunteerPortalData } from '@/composables/useVolunteerPortalData'

const { events } = useVolunteerPortalData()
</script>

<template>
  <section
    aria-labelledby="volunteer-upcoming-events-heading"
    class="bg-surface px-5 py-14 sm:px-8"
  >
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2
        id="volunteer-upcoming-events-heading"
        class="text-2xl font-bold text-text-default sm:text-3xl"
      >
        Upcoming events
      </h2>
      <p v-if="events.length === 0" class="text-base text-text-muted">
        There are no upcoming events right now.
      </p>
      <ul v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="event in events" :key="event.id">
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
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
