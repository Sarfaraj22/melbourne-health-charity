<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ExploreSubpageNav from '@/components/ui/ExploreSubpageNav.vue'
import { useDonateContent } from '@/composables/useDonateContent'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Donate' }]
const { heroHeading, heroIntro, heroImage, subpageLinks } = useDonateContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <PageHero
      heading-id="donate-hero-heading"
      :heading="heroHeading"
      :intro="heroIntro"
      :image="heroImage"
    />
    <ExploreSubpageNav
      heading-id="donate-explore-heading"
      heading="Ways to give"
      :links="subpageLinks"
    />
  </div>
</template>
