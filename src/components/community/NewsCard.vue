<script setup lang="ts">
import type { NewsArticle } from '@/types/community'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'

interface Props {
  readonly article: NewsArticle
  readonly showReadMore: boolean
}

defineProps<Props>()
</script>

<template>
  <BaseCard interactive class="h-full">
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
      v-if="showReadMore"
      to="/community"
      class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Read more
    </router-link>
  </BaseCard>
</template>
