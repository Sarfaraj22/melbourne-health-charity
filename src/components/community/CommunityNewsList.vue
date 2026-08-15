<script setup lang="ts">
import NewsCard from '@/components/community/NewsCard.vue'
import { useCommunityContent } from '@/composables/useCommunityContent'

const { news } = useCommunityContent()
</script>

<template>
  <section id="news" aria-labelledby="community-news-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 id="community-news-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          News
        </h2>
        <p class="max-w-2xl text-base text-text-muted">
          Updates from our programs, partnerships, and the Melbourne disability community.
        </p>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="article in news" :key="article.id" class="flex">
          <NewsCard :article="article" :show-read-more="false" />
        </li>
      </ul>
    </div>
  </section>
</template>
