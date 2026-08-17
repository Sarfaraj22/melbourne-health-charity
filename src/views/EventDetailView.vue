<script setup lang="ts">
import { computed } from 'vue'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EventDetailInfo from '@/components/events/EventDetailInfo.vue'
import EventRegistrationForm from '@/components/events/EventRegistrationForm.vue'
import { getEventBySlug } from '@/composables/useEventsContent'
import type { BreadcrumbItem } from '@/types/service'

interface Props {
  readonly eventSlug: string
}

const props = defineProps<Props>()

const event = computed(() => getEventBySlug(props.eventSlug))

const crumbs = computed((): readonly BreadcrumbItem[] => {
  if (event.value === undefined) {
    return [{ label: 'Home', to: '/' }, { label: 'Events', to: '/events' }, { label: 'Not found' }]
  }
  return [
    { label: 'Home', to: '/' },
    { label: 'Events', to: '/events' },
    { label: event.value.title },
  ]
})
</script>

<template>
  <div v-if="event" class="bg-surface">
    <AppBreadcrumb :crumbs="crumbs" />

    <div class="mx-auto max-w-container px-5 py-12 sm:px-8">
      <div class="grid grid-cols-1 gap-10 lg:flex lg:items-start lg:gap-10">
        <div class="min-w-0 flex-1">
          <EventDetailInfo :event="event" />
        </div>
        <div class="lg:w-96 lg:shrink-0">
          <EventRegistrationForm
            v-if="event.registrationOpen"
            :event-title="event.title"
            :event-slug="props.eventSlug"
          />
          <aside
            v-else
            aria-labelledby="registration-closed-heading"
            class="rounded-lg border border-border-default bg-surface-muted p-6"
          >
            <h2 id="registration-closed-heading" class="text-lg font-bold text-text-default">
              Registration closed
            </h2>
            <p class="mt-2 text-sm text-text-muted">
              Registration for {{ event.title }} is no longer open. Browse our other events for more
              opportunities to take part.
            </p>
            <AppButton variant="secondary" class="mt-4" to="/events">View all events</AppButton>
          </aside>
        </div>
      </div>
    </div>
  </div>

  <section
    v-else
    class="mx-auto flex min-h-placeholder max-w-container flex-col items-center justify-center gap-3 px-5 py-20 text-center sm:px-8"
  >
    <h1 class="text-3xl font-bold text-text-default">Event not found</h1>
    <p class="max-w-md text-base text-text-muted">
      We could not find the event you are looking for. Browse our available events instead.
    </p>
    <AppButton to="/events" variant="secondary">View all events</AppButton>
  </section>
</template>
