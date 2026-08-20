<script setup lang="ts">
import Icon from '@/components/ui/AppIcon.vue'
import bookmarkIcon from '@/assets/icons/bookmark.svg?raw'

interface Props {
  readonly savedCount: number
}

defineProps<Props>()
</script>

<template>
  <section
    aria-labelledby="resource-center-heading"
    class="flex flex-col items-center gap-5 bg-surface-muted px-5 py-14 text-center sm:px-8"
  >
    <div class="flex flex-col gap-3">
      <h1 id="resource-center-heading" class="text-3xl font-bold text-text-default sm:text-4xl">
        Resource Center
      </h1>
      <p class="max-w-2xl text-base text-text-muted">
        Explore guides, articles, and videos, and find other Melbourne disability service providers.
      </p>
    </div>

    <p
      v-if="savedCount > 0"
      class="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent-dark"
    >
      <Icon :svg="bookmarkIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
      {{ savedCount }} saved
    </p>
  </section>
</template>
