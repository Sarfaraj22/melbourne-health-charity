<script setup lang="ts">
import PageHero from '@/components/ui/PageHero.vue'
import { useCommunityContent } from '@/composables/useCommunityContent'

const { heroHeading, heroIntro, heroImage } = useCommunityContent()
</script>

<template>
  <PageHero
    heading-id="community-hero-heading"
    :heading="heroHeading"
    :intro="heroIntro"
    :image="heroImage"
  />
</template>
