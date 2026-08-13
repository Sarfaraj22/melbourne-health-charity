<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useHomeContent } from '@/composables/useHomeContent'

const { news } = useHomeContent()
</script>

<template>
  <section aria-labelledby="news-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 id="news-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Latest News
        </h2>
        <router-link
          to="/community"
          class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          View all news →
        </router-link>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="article in news" :key="article.id">
          <BaseCard interactive>
            <ResponsiveImage
              :image="article.image"
              :image-jpg="article.imageJpg"
              :image-small="article.imageSmall"
              :image-small-jpg="article.imageSmallJpg"
              :alt="article.imageAlt"
              class-name="mb-2 h-36 w-full rounded object-cover"
            />
            <p class="text-xs font-medium text-text-subtle">{{ article.publishedOn }}</p>
            <h3 class="text-base font-bold text-text-default">{{ article.headline }}</h3>
            <p class="text-sm text-text-muted">{{ article.excerpt }}</p>
            <router-link
              :to="article.readMoreTo"
              class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Read more
            </router-link>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
