<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ExploreSubpageNav from '@/components/ui/ExploreSubpageNav.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'About' }]
const { heroHeading, heroIntro, heroImage, missionBlurb, subpageLinks } = useAboutContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <PageHero
      heading-id="about-hero-heading"
      :heading="heroHeading"
      :intro="heroIntro"
      :image="heroImage"
    />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <p class="mx-auto max-w-container text-center text-base text-text-muted">
        {{ missionBlurb }}
      </p>
    </section>
    <ExploreSubpageNav
      heading-id="about-explore-heading"
      heading="Explore about us"
      :links="subpageLinks"
    />
  </div>
</template>
