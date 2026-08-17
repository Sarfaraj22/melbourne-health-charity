<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const resources = content.savedResources

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Saved Resources' },
]
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Saved Resources">
    <ul
      class="flex flex-col divide-y divide-border-default rounded-md border border-border-default bg-surface"
    >
      <li v-for="resource in resources" :key="resource.id" class="flex flex-col gap-1 p-5">
        <router-link
          :to="resource.href"
          class="text-base font-bold text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {{ resource.title }}
        </router-link>
        <p class="text-sm capitalize text-text-muted">{{ resource.kind }}</p>
      </li>
    </ul>
  </DashboardLayout>
</template>
