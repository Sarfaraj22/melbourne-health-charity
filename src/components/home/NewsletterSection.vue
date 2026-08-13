<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const email = ref('')
</script>

<template>
  <section
    aria-labelledby="newsletter-heading"
    class="flex flex-col items-center gap-4 bg-surface-muted px-5 py-14 sm:px-8"
  >
    <h2
      id="newsletter-heading"
      class="text-center text-2xl font-bold text-text-default sm:text-3xl"
    >
      Stay Updated
    </h2>
    <p class="max-w-md text-center text-sm text-text-muted">
      Subscribe to our newsletter for the latest news, events and resources.
    </p>
    <form class="flex flex-col items-center gap-3 sm:flex-row" @submit.prevent>
      <label for="newsletter-email" class="sr-only">Enter your email address</label>
      <input
        id="newsletter-email"
        v-model="email"
        type="email"
        placeholder="Enter your email address"
        class="w-full max-w-sm rounded border border-border-strong bg-surface px-4 py-3 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      />
      <AppButton type="submit" variant="primary" size="sm">Subscribe</AppButton>
    </form>
  </section>
</template>
