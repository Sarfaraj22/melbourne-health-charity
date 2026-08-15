<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Team' },
]
const { teamIntro, team } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Our Team" :intro="teamIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <ul class="mx-auto grid max-w-container gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="member in team" :key="member.id">
          <BaseCard class="h-full">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-sm font-bold text-brand-primary"
              aria-hidden="true"
            >
              {{ member.initials }}
            </span>
            <h2 class="text-base font-bold text-text-default">{{ member.name }}</h2>
            <p class="text-xs font-medium text-text-subtle">{{ member.role }}</p>
            <p class="text-sm text-text-muted">{{ member.bio }}</p>
          </BaseCard>
        </li>
      </ul>
    </section>
  </div>
</template>
