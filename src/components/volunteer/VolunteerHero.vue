<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useVolunteerContent, volunteerHeroImage } from '@/composables/useVolunteerContent'
import { useAuthStore } from '@/stores/auth.store'

const { heroHeading, heroIntro, portalCtaLabel, portalCtaTo } = useVolunteerContent()
const authStore = useAuthStore()

const resolvedPortalTo = computed<string>(() =>
  authStore.isAuthenticated ? portalCtaTo : '/login?redirect=/volunteer/portal',
)
</script>

<template>
  <PageHero
    heading-id="volunteer-hero-heading"
    :heading="heroHeading"
    :intro="heroIntro"
    :image="volunteerHeroImage"
  >
    <AppButton variant="primary" :to="resolvedPortalTo">{{ portalCtaLabel }}</AppButton>
  </PageHero>
</template>
