<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useVolunteerContent, volunteerHeroImage } from '@/composables/useVolunteerContent'

const { heroHeading, heroIntro, portalCtaLabel, portalCtaTo } = useVolunteerContent()
</script>

<template>
  <section aria-labelledby="volunteer-hero-heading" class="flex flex-col items-center bg-surface">
    <ResponsiveImage
      :image="volunteerHeroImage.image"
      :image-jpg="volunteerHeroImage.imageJpg"
      :image-small="volunteerHeroImage.imageSmall"
      :image-small-jpg="volunteerHeroImage.imageSmallJpg"
      :alt="volunteerHeroImage.imageAlt"
      sizes="100vw"
      :width="800"
      :height="450"
      loading="eager"
      class-name="h-72 w-full object-cover sm:h-96"
    />
    <div class="mx-auto flex w-full max-w-container flex-col items-center gap-5 px-5 py-14 sm:px-8">
      <h1
        id="volunteer-hero-heading"
        class="max-w-3xl text-center text-3xl font-bold text-text-default sm:text-4xl"
      >
        {{ heroHeading }}
      </h1>
      <p class="max-w-xl text-center text-base text-text-muted">{{ heroIntro }}</p>
      <AppButton variant="primary" :to="portalCtaTo">{{ portalCtaLabel }}</AppButton>
    </div>
  </section>
</template>
