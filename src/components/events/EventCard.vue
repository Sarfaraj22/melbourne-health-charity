<script setup lang="ts">
import type { EventDetail } from '@/types/event'
import AppButton from '@/components/ui/AppButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'

interface Props {
  readonly event: EventDetail
}

defineProps<Props>()
</script>

<template>
  <BaseCard interactive class="h-full w-full">
    <ResponsiveImage
      :image="event.images.image"
      :image-jpg="event.images.imageJpg"
      :image-small="event.images.imageSmall"
      :image-small-jpg="event.images.imageSmallJpg"
      :alt="event.images.imageAlt"
      picture-class-name="block w-full"
      class-name="mb-2 h-36 w-full rounded object-cover"
    />
    <div class="flex items-center gap-2">
      <span
        class="inline-block w-fit rounded border border-brand-primary px-2.5 py-1 text-xs font-bold text-brand-primary"
      >
        {{ event.dateBadge }}
      </span>
      <span
        v-if="event.status === 'future'"
        class="inline-block w-fit rounded border border-border-strong px-2.5 py-1 text-xs font-bold text-text-subtle"
      >
        Future
      </span>
    </div>
    <h3 class="text-base font-bold text-text-default">{{ event.title }}</h3>
    <p class="text-sm text-text-muted">{{ event.summary }}</p>
    <p class="text-sm font-medium text-text-subtle">
      {{ event.time }} · {{ event.location.split(';')[0] }}
    </p>
    <AppButton variant="secondary" size="sm" class="mt-auto" :to="`/events/${event.slug}`">
      View details
    </AppButton>
  </BaseCard>
</template>
