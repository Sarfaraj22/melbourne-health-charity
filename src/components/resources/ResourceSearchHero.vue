<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import Icon from '@/components/ui/AppIcon.vue'
import bookmarkIcon from '@/assets/icons/bookmark.svg?raw'
import searchIcon from '@/assets/icons/search.svg?raw'

interface Props {
  readonly modelValue: string
  readonly savedCount: number
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
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
        Explore guides, articles, and videos to support you and your family.
      </p>
    </div>

    <p
      v-if="savedCount > 0"
      class="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent-dark"
    >
      <Icon :svg="bookmarkIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
      {{ savedCount }} saved
    </p>

    <form role="search" class="flex w-full max-w-2xl flex-col gap-3 sm:flex-row" @submit.prevent>
      <label class="sr-only" for="resource-search">Search resources</label>
      <div class="relative flex-1">
        <Icon
          :svg="searchIcon"
          class-name="pointer-events-none absolute left-4 top-1/2 inline-flex -translate-y-1/2 text-text-subtle [&>svg]:h-5 [&>svg]:w-5"
        />
        <input
          id="resource-search"
          type="search"
          name="resource-search"
          placeholder="Search resources (e.g. mental health, NDIS, mobility)"
          :value="modelValue"
          class="w-full rounded border border-border-strong bg-surface py-3 pl-12 pr-4 text-base text-text-default placeholder:text-text-subtle focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <AppButton type="submit" variant="primary" class="sm:self-start">Search</AppButton>
    </form>
  </section>
</template>
