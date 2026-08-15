<script setup lang="ts">
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useContactContent } from '@/composables/useContactContent'

const { heroHeading, heroIntro, heroImage } = useContactContent()
</script>

<template>
  <section aria-labelledby="contact-hero-heading" class="flex flex-col items-center bg-surface">
    <ResponsiveImage
      :image="heroImage.image"
      :image-jpg="heroImage.imageJpg"
      :image-small="heroImage.imageSmall"
      :image-small-jpg="heroImage.imageSmallJpg"
      :alt="heroImage.imageAlt"
      sizes="100vw"
      :width="800"
      :height="450"
      loading="eager"
      class-name="h-72 w-full object-cover sm:h-96"
    />
    <div class="mx-auto flex w-full max-w-container flex-col items-center gap-5 px-5 py-14 sm:px-8">
      <h1
        id="contact-hero-heading"
        class="max-w-3xl text-center text-3xl font-bold text-text-default sm:text-4xl"
      >
        {{ heroHeading }}
      </h1>
      <p class="max-w-xl text-center text-base text-text-muted">{{ heroIntro }}</p>
    </div>
  </section>
</template>
