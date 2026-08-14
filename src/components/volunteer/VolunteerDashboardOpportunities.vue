<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { dashboard } = useVolunteerContent()
const { opportunities } = dashboard
</script>

<template>
  <section
    aria-labelledby="volunteer-dashboard-opportunities-heading"
    class="bg-surface-muted px-5 py-14 sm:px-8"
  >
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2
          id="volunteer-dashboard-opportunities-heading"
          class="text-2xl font-bold text-text-default sm:text-3xl"
        >
          Opportunities for you
        </h2>
        <router-link
          to="/volunteer/opportunities"
          class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          View all &rarr;
        </router-link>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="opportunity in opportunities" :key="opportunity.id">
          <BaseCard interactive class="h-full">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-brand-primary"
            >
              <AppIcon :svg="opportunity.icon" class-name="h-6 w-6" />
            </span>
            <span
              class="inline-block w-fit rounded border border-brand-primary px-2.5 py-1 text-xs font-bold text-brand-primary"
            >
              {{ opportunity.categoryLabel }}
            </span>
            <h3 class="text-base font-bold text-text-default">{{ opportunity.title }}</h3>
            <p class="text-sm text-text-muted">{{ opportunity.description }}</p>
            <p class="text-sm font-medium text-text-subtle">
              Commitment: {{ opportunity.commitment }}
            </p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
