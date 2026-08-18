<script setup lang="ts">
import { useVolunteerPortalData } from '@/composables/useVolunteerPortalData'

const { profile, trainingProgress } = useVolunteerPortalData()
</script>

<template>
  <section aria-labelledby="volunteer-portal-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <span
            class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-text-on-brand"
            aria-hidden="true"
          >
            {{ profile.initials }}
          </span>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-text-subtle">{{ profile.role }}</span>
            <h1
              id="volunteer-portal-heading"
              class="text-2xl font-bold text-text-default sm:text-3xl"
            >
              Welcome back, {{ profile.name }}
            </h1>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-lg border border-border-default bg-surface-muted p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-text-default">Training progress</h2>
          <span class="text-sm font-medium text-brand-primary"
            >{{ trainingProgress.percent }}%</span
          >
        </div>
        <div
          class="h-2 w-full overflow-hidden rounded-full bg-border-default"
          role="progressbar"
          :aria-valuenow="trainingProgress.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Training progress"
        >
          <div
            class="h-full rounded-full bg-brand-primary"
            :style="{ width: `${trainingProgress.percent}%` }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
