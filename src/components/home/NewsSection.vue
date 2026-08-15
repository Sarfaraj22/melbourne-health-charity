<script setup lang="ts">
import NewsCard from '@/components/community/NewsCard.vue'
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
        <li v-for="article in news" :key="article.id" class="flex">
          <NewsCard :article="article" :show-read-more="true" />
        </li>
      </ul>
    </div>
  </section>
</template>
