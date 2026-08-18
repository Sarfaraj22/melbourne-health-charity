<script setup lang="ts">
import { computed } from 'vue'
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

    <p v-if="resources.length === 0" class="text-sm text-text-muted">
      You have not saved any resources yet.
    </p>
    <ul v-else class="flex flex-col divide-y divide-border-default">
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
