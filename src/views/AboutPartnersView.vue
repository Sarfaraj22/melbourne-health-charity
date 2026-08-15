<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Partners & Sponsors' },
]
const { partnersIntro, partners } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Partners & Sponsors" :intro="partnersIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <ul class="mx-auto grid max-w-container gap-5 sm:grid-cols-3">
        <li v-for="partner in partners" :key="partner.id">
          <BaseCard class="h-full">
            <h2 class="text-base font-bold text-text-default">{{ partner.name }}</h2>
            <p class="text-sm text-text-muted">{{ partner.description }}</p>
          </BaseCard>
        </li>
      </ul>
    </section>
  </div>
</template>
