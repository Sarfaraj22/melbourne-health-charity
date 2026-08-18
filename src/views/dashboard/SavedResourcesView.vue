<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { getResourceById } from '@/composables/useResourcesContent'
import { useSavedResourcesStore } from '@/stores/savedResources.store'
import type { DashboardResourceKind, DashboardSavedResource } from '@/types/dashboard'
import type { ResourceFormat } from '@/types/resource'

function toResourceKind(format: ResourceFormat): DashboardResourceKind {
  if (format === 'video') {
    return 'video'
  }
  if (format === 'article') {
    return 'article'
  }
  return 'guide'
}

const savedStore = useSavedResourcesStore()

const resources = computed((): readonly DashboardSavedResource[] => {
  const items: DashboardSavedResource[] = []
  for (const id of savedStore.savedIds) {
    const resource = getResourceById(id)
    if (resource === undefined) {
      continue
    }
    items.push({
      id: resource.id,
      title: resource.title,
      kind: toResourceKind(resource.format),
      href: '/resources',
    })
  }
  return items
})

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Saved Resources' },
]
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Saved Resources">
    <p v-if="resources.length === 0" class="text-base text-text-muted">
      You have not saved any resources yet.
      <router-link
        to="/resources"
        class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Browse resources
      </router-link>
    </p>
    <ul
      v-else
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
