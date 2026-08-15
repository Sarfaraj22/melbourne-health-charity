<script setup lang="ts">
import type { ExploreLink } from '@/types/explore'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

interface Props {
  readonly headingId: string
  readonly heading: string
  readonly links: readonly ExploreLink[]
}

defineProps<Props>()
</script>

<template>
  <section :aria-labelledby="headingId" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 :id="headingId" class="text-2xl font-bold text-text-default sm:text-3xl">
        {{ heading }}
      </h2>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="link in links" :key="link.id">
          <router-link
            :to="link.to"
            class="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <BaseCard interactive class="h-full">
              <span
                class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
              >
                <AppIcon :svg="link.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
              </span>
              <h3 class="text-lg font-bold text-text-default">{{ link.label }}</h3>
              <p class="text-sm text-text-muted">{{ link.description }}</p>
              <span class="text-sm font-bold text-brand-primary">Learn more &rarr;</span>
            </BaseCard>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
