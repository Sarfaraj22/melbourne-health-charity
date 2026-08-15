<script setup lang="ts">
import PageHero from '@/components/ui/PageHero.vue'
import { useContactContent } from '@/composables/useContactContent'

const { heroHeading, heroIntro, heroImage } = useContactContent()
</script>

<template>
  <PageHero
    heading-id="contact-hero-heading"
    :heading="heroHeading"
    :intro="heroIntro"
    :image="heroImage"
  />
</template>
