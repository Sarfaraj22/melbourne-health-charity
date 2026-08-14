<script setup lang="ts">
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { steps } = useVolunteerContent()
</script>

<template>
  <section aria-labelledby="volunteer-steps-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-steps-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        How to get started
      </h2>
      <ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex flex-col gap-2 rounded-lg border border-border-default bg-surface p-5"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-text-on-brand"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>
          <h3 class="text-base font-bold text-text-default">{{ step.title }}</h3>
          <p class="text-sm text-text-muted">{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
