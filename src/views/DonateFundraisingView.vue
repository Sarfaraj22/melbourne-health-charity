<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useDonateContent } from '@/composables/useDonateContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Donate', to: '/donate' },
  { label: 'Fundraising Campaigns' },
]
const { campaignsIntro, campaigns } = useDonateContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Fundraising Campaigns" :intro="campaignsIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <ul class="mx-auto grid max-w-container gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="campaign in campaigns" :key="campaign.id">
          <BaseCard interactive class="h-full">
            <ResponsiveImage
              :image="campaign.images.image"
              :image-jpg="campaign.images.imageJpg"
              :image-small="campaign.images.imageSmall"
              :image-small-jpg="campaign.images.imageSmallJpg"
              :alt="campaign.images.imageAlt"
              class-name="mb-2 h-36 w-full rounded object-cover"
            />
            <h2 class="text-base font-bold text-text-default">{{ campaign.title }}</h2>
            <p class="text-sm text-text-muted">{{ campaign.summary }}</p>
            <router-link
              :to="campaign.to"
              class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {{ campaign.ctaLabel }}
            </router-link>
          </BaseCard>
        </li>
      </ul>
    </section>
  </div>
</template>
