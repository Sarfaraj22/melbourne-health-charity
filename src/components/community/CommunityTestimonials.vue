<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useCommunityContent } from '@/composables/useCommunityContent'
import quoteIcon from '@/assets/icons/quote.svg?raw'

const { testimonials } = useCommunityContent()
</script>

<template>
  <section aria-labelledby="community-testimonials-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2
          id="community-testimonials-heading"
          class="text-2xl font-bold text-text-default sm:text-3xl"
        >
          Testimonials
        </h2>
        <p class="max-w-2xl text-base text-text-muted">
          What participants, families, and volunteers say about being part of our community.
        </p>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in testimonials" :key="item.id" class="flex">
          <BaseCard class="h-full w-full">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
            >
              <AppIcon :svg="quoteIcon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
            </span>
            <blockquote>
              <p class="text-sm text-text-muted">{{ item.quote }}</p>
              <footer class="mt-2 flex flex-col gap-0.5">
                <cite class="text-sm font-bold not-italic text-text-default">{{ item.name }}</cite>
                <p class="text-xs font-medium text-text-subtle">{{ item.role }}</p>
              </footer>
            </blockquote>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
