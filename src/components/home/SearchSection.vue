<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const query = ref('')
</script>

<template>
  <section aria-labelledby="search-heading" class="bg-surface-muted px-5 py-8 sm:px-8">
    <h2 id="search-heading" class="sr-only">Search support services</h2>
    <form
      role="search"
      class="mx-auto flex max-w-container flex-col items-center gap-3 sm:flex-row sm:justify-center"
      @submit.prevent
    >
      <label for="support-search" class="sr-only">What support are you looking for?</label>
      <input
        id="support-search"
        v-model="query"
        type="search"
        placeholder="What support are you looking for?"
        class="w-full max-w-md rounded border border-border-strong bg-surface px-5 py-3.5 text-base text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      />
      <AppButton type="submit" variant="primary" size="sm">Search</AppButton>
    </form>
  </section>
</template>
