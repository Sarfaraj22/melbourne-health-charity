<script setup lang="ts">
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { dashboard } = useVolunteerContent()
const { stats } = dashboard
</script>

<template>
  <section aria-labelledby="volunteer-summary-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-summary-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Your impact
      </h2>
      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="stat in stats"
          :key="stat.id"
          class="flex flex-col gap-1 rounded-lg border border-border-default bg-surface p-5"
        >
          <span class="text-xs font-bold tracking-wide text-text-subtle">{{ stat.label }}</span>
          <span class="text-3xl font-bold text-text-default">{{ stat.value }}</span>
          <span class="text-sm text-text-muted">{{ stat.caption }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
