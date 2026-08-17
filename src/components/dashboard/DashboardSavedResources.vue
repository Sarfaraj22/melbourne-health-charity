<script setup lang="ts">
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const resources = content.savedResources
</script>

<template>
  <section class="flex flex-col gap-4" aria-labelledby="dashboard-saved-resources-heading">
    <div class="flex items-center justify-between gap-2">
      <h2 id="dashboard-saved-resources-heading" class="text-lg font-bold text-text-default">
        Saved Resources
      </h2>
      <router-link
        to="/dashboard/saved-resources"
        class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        View all
      </router-link>
    </div>

    <ul class="flex flex-col divide-y divide-border-default">
      <li v-for="resource in resources" :key="resource.id" class="flex flex-col gap-1 py-3">
        <router-link
          :to="resource.href"
          class="text-sm font-bold text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {{ resource.title }}
        </router-link>
        <p class="text-sm capitalize text-text-muted">{{ resource.kind }}</p>
      </li>
    </ul>
  </section>
</template>
