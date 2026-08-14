<script setup lang="ts">
import type { ResourceItem } from '@/types/resource'
import ResourceCard from '@/components/resources/ResourceCard.vue'

interface Props {
  readonly resources: readonly ResourceItem[]
  readonly savedIds: ReadonlySet<string>
}

defineProps<Props>()

defineEmits<{
  'toggle-save': [id: string]
}>()
</script>

<template>
  <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="resource in resources" :key="resource.id" class="h-full">
      <ResourceCard
        :resource="resource"
        :is-saved="savedIds.has(resource.id)"
        @toggle-save="$emit('toggle-save', $event)"
      />
    </li>
  </ul>
</template>
