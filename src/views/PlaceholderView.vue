<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.meta['title'] ?? 'Page'
</script>

<template>
  <section
    class="mx-auto flex min-h-placeholder max-w-container flex-col items-center justify-center gap-3 px-5 py-20 text-center sm:px-8"
  >
    <h1 class="text-3xl font-bold text-text-default">{{ title }}</h1>
    <p class="max-w-md text-base text-text-muted">
      This page is coming soon. We're working hard to bring you this content.
    </p>
    <router-link
      to="/"
      class="text-base font-bold text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Back to home
    </router-link>
  </section>
</template>
