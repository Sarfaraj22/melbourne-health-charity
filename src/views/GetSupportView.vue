<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ExploreSubpageNav from '@/components/ui/ExploreSubpageNav.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useGetSupportContent } from '@/composables/useGetSupportContent'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Get Support' }]
const { heroHeading, heroIntro, heroImage, subpageLinks, crisisNote } = useGetSupportContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <PageHero
      heading-id="get-support-hero-heading"
      :heading="heroHeading"
      :intro="heroIntro"
      :image="heroImage"
    />
    <ExploreSubpageNav
      heading-id="get-support-explore-heading"
      heading="Ways we can help"
      :links="subpageLinks"
    />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col items-start gap-4">
        <p class="max-w-2xl text-base text-text-muted">{{ crisisNote }}</p>
        <AppButton variant="secondary" to="/contact">Contact us</AppButton>
      </div>
    </section>
  </div>
</template>
