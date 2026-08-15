<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useAboutContent } from '@/composables/useAboutContent'
import downloadIcon from '@/assets/icons/download.svg?raw'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Annual Reports' },
]
const { reportsIntro, reports } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Annual Reports" :intro="reportsIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <ul class="mx-auto grid max-w-container gap-5 sm:grid-cols-2">
        <li v-for="report in reports" :key="report.id">
          <BaseCard class="h-full">
            <p class="text-xs font-medium text-text-subtle">{{ report.year }}</p>
            <h2 class="text-base font-bold text-text-default">{{ report.title }}</h2>
            <p class="text-sm text-text-muted">{{ report.summary }}</p>
            <a
              :href="report.fileUrl"
              class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              :aria-label="`Download ${report.title}`"
            >
              <AppIcon :svg="downloadIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
              Download
            </a>
          </BaseCard>
        </li>
      </ul>
    </section>
  </div>
</template>
