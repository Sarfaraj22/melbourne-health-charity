<script setup lang="ts">
import type { PageImageSet } from '@/types/explore'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'

interface Props {
  readonly headingId: string
  readonly heading: string
  readonly intro: string
  readonly image: PageImageSet
}

defineProps<Props>()
</script>

<template>
  <section :aria-labelledby="headingId" class="flex flex-col items-center bg-surface">
    <ResponsiveImage
      :image="image.image"
      :image-jpg="image.imageJpg"
      :image-small="image.imageSmall"
      :image-small-jpg="image.imageSmallJpg"
      :alt="image.imageAlt"
      sizes="100vw"
      :width="800"
      :height="450"
      loading="eager"
      class-name="h-72 w-full object-cover sm:h-96"
    />
    <div class="mx-auto flex w-full max-w-container flex-col items-center gap-5 px-5 py-14 sm:px-8">
      <h1
        :id="headingId"
        class="max-w-3xl text-center text-3xl font-bold text-text-default sm:text-4xl"
      >
        {{ heading }}
      </h1>
      <p class="max-w-xl text-center text-base text-text-muted">{{ intro }}</p>
    </div>
  </section>
</template>
