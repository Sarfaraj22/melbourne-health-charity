<script setup lang="ts">
import type { EventDetail } from '@/types/event'
import AppIcon from '@/components/ui/AppIcon.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'
import clockIcon from '@/assets/icons/clock.svg?raw'
import mapPinIcon from '@/assets/icons/map-pin.svg?raw'
import banknoteIcon from '@/assets/icons/banknote.svg?raw'

interface Props {
  readonly event: EventDetail
}

defineProps<Props>()
</script>

<template>
  <article class="flex flex-col gap-6">
    <ResponsiveImage
      :image="event.images.image"
      :image-jpg="event.images.imageJpg"
      :image-small="event.images.imageSmall"
      :image-small-jpg="event.images.imageSmallJpg"
      :alt="event.images.imageAlt"
      class-name="h-64 w-full rounded-lg object-cover sm:h-80"
      sizes="(min-width: 1024px) 66vw, 100vw"
    />

    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="inline-block w-fit rounded border border-brand-primary px-2.5 py-1 text-xs font-bold text-brand-primary"
        >
          {{ event.dateBadge }}
        </span>
        <span
          v-if="event.status === 'future'"
          class="inline-block w-fit rounded border border-border-strong px-2.5 py-1 text-xs font-bold text-text-subtle"
        >
          Future event
        </span>
        <span
          v-else
          class="inline-block w-fit rounded border border-brand-accent px-2.5 py-1 text-xs font-bold text-brand-accent"
        >
          Current event
        </span>
      </div>
      <h1 class="text-3xl font-bold text-text-default sm:text-4xl">{{ event.title }}</h1>
      <p class="max-w-2xl text-base text-text-muted">{{ event.summary }}</p>
    </div>

    <p class="text-base text-text-default">{{ event.description }}</p>

    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="calendarDaysIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Date</dt>
          <dd class="text-sm font-medium text-text-default">{{ event.date }}</dd>
        </div>
      </div>
      <div
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="clockIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Time</dt>
          <dd class="text-sm font-medium text-text-default">{{ event.time }}</dd>
        </div>
      </div>
      <div
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="mapPinIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Location</dt>
          <dd class="text-sm font-medium text-text-default">{{ event.location }}</dd>
        </div>
      </div>
      <div
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="banknoteIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Cost</dt>
          <dd class="text-sm font-medium text-text-default">{{ event.cost }}</dd>
        </div>
      </div>
    </dl>
  </article>
</template>
