<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useDonateContent } from '@/composables/useDonateContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Donate', to: '/donate' },
  { label: 'Corporate Partnerships' },
]
const { corporateIntro, corporatePoints } = useDonateContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Corporate Partnerships" :intro="corporateIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col items-start gap-6">
        <ul class="flex max-w-2xl flex-col gap-3">
          <li
            v-for="point in corporatePoints"
            :key="point"
            class="rounded-lg border border-border-default bg-surface p-5 text-sm text-text-muted"
          >
            {{ point }}
          </li>
        </ul>
        <AppButton variant="primary" to="/contact">Enquire about a partnership</AppButton>
      </div>
    </section>
  </div>
</template>
