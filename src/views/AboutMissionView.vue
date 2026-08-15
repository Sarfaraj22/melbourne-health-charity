<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Mission' },
]
const { missionStatement, values } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Our Mission" :intro="missionStatement" />
    <section aria-labelledby="about-values-heading" class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h2 id="about-values-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Our values
        </h2>
        <ul class="grid gap-5 sm:grid-cols-3">
          <li v-for="value in values" :key="value.id">
            <BaseCard class="h-full">
              <h3 class="text-base font-bold text-text-default">{{ value.title }}</h3>
              <p class="text-sm text-text-muted">{{ value.description }}</p>
            </BaseCard>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
