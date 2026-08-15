<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useVolunteerContent, volunteerHeroImage } from '@/composables/useVolunteerContent'

const { heroHeading, heroIntro, portalCtaLabel, portalCtaTo } = useVolunteerContent()
</script>

<template>
  <PageHero
    heading-id="volunteer-hero-heading"
    :heading="heroHeading"
    :intro="heroIntro"
    :image="volunteerHeroImage"
  >
    <AppButton variant="primary" :to="portalCtaTo">{{ portalCtaLabel }}</AppButton>
  </PageHero>
</template>
