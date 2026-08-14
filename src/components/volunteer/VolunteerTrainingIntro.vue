<script setup lang="ts">
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { trainingIntro } = useVolunteerContent()
</script>

<template>
  <section
    aria-labelledby="volunteer-training-heading"
    class="flex flex-col items-center gap-5 bg-surface-muted px-5 py-14 text-center sm:px-8"
  >
    <h2
      id="volunteer-training-heading"
      class="max-w-3xl text-3xl font-bold text-text-default sm:text-4xl"
    >
      Training resources
    </h2>
    <p class="max-w-2xl text-base text-text-muted">{{ trainingIntro }}</p>
  </section>
</template>
