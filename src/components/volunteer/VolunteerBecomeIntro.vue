<script setup lang="ts">
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { becomeIntro, becomeImage } = useVolunteerContent()
</script>

<template>
  <section aria-labelledby="volunteer-become-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto grid max-w-container items-center gap-8 lg:grid-cols-2">
      <ResponsiveImage
        :image="becomeImage.image"
        :image-jpg="becomeImage.imageJpg"
        :image-small="becomeImage.imageSmall"
        :image-small-jpg="becomeImage.imageSmallJpg"
        :alt="becomeImage.imageAlt"
        sizes="(min-width: 1024px) 50vw, 100vw"
        class-name="h-64 w-full rounded-lg object-cover sm:h-80"
      />
      <div class="flex flex-col gap-4">
        <h2 id="volunteer-become-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Become a volunteer
        </h2>
        <p class="text-base text-text-muted">{{ becomeIntro }}</p>
      </div>
    </div>
  </section>
</template>
