<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Story' },
]
const { storyIntro, milestones } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Our Story" :intro="storyIntro" />
    <section aria-labelledby="about-milestones-heading" class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h2 id="about-milestones-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Milestones
        </h2>
        <ol class="flex flex-col gap-5">
          <li
            v-for="item in milestones"
            :key="item.id"
            class="rounded-lg border border-border-default bg-surface p-5"
          >
            <p class="text-xs font-bold uppercase tracking-wide text-brand-accent">
              {{ item.year }}
            </p>
            <h3 class="mt-1 text-base font-bold text-text-default">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-text-muted">{{ item.description }}</p>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
