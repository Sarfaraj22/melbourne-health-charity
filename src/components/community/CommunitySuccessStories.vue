<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useCommunityContent } from '@/composables/useCommunityContent'

const { stories } = useCommunityContent()
</script>

<template>
  <section aria-labelledby="community-stories-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 id="community-stories-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Success stories
        </h2>
        <p class="max-w-2xl text-base text-text-muted">
          People in our community sharing how the right supports changed daily life.
        </p>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="story in stories" :key="story.id" class="flex">
          <BaseCard interactive class="h-full w-full">
            <ResponsiveImage
              :image="story.images.image"
              :image-jpg="story.images.imageJpg"
              :image-small="story.images.imageSmall"
              :image-small-jpg="story.images.imageSmallJpg"
              :alt="story.images.imageAlt"
              class-name="mb-2 h-36 w-full rounded object-cover"
            />
            <h3 class="text-base font-bold text-text-default">{{ story.title }}</h3>
            <p class="text-xs font-medium text-text-subtle">{{ story.name }}</p>
            <p class="text-sm text-text-muted">{{ story.summary }}</p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
