<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ResourceFilterGroup, ResourceFormatId, ResourceTopicId } from '@/types/resource'
import Icon from '@/components/ui/AppIcon.vue'
import slidersIcon from '@/assets/icons/sliders-horizontal.svg?raw'

interface Props {
  readonly filterGroups: readonly ResourceFilterGroup[]
  readonly selectedTopics: ReadonlySet<ResourceTopicId>
  readonly selectedFormats: ReadonlySet<ResourceFormatId>
  readonly hasActiveFilters: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'toggle-topic': [id: ResourceTopicId]
  'toggle-format': [id: ResourceFormatId]
  'clear-filters': []
}>()

type TopicsGroup = Extract<ResourceFilterGroup, { id: 'topics' }>
type FormatsGroup = Extract<ResourceFilterGroup, { id: 'formats' }>

function isTopicsGroup(group: ResourceFilterGroup): group is TopicsGroup {
  return group.id === 'topics'
}

function isFormatsGroup(group: ResourceFilterGroup): group is FormatsGroup {
  return group.id === 'formats'
}

const topicsGroup = computed(() => props.filterGroups.find(isTopicsGroup))
const formatsGroup = computed(() => props.filterGroups.find(isFormatsGroup))

const isMobilePanelOpen = ref(false)

function toggleMobilePanel(): void {
  isMobilePanelOpen.value = !isMobilePanelOpen.value
}
</script>

<template>
  <aside aria-label="Filter resources" class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-text-default">Filter</h2>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        @click="$emit('clear-filters')"
      >
        Clear all
      </button>
    </div>

    <button
      type="button"
      class="flex items-center gap-2 rounded border border-border-strong bg-surface px-4 py-3 text-base font-medium text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary lg:hidden"
      :aria-expanded="isMobilePanelOpen"
      aria-controls="resource-filter-panel"
      @click="toggleMobilePanel"
    >
      <Icon :svg="slidersIcon" class-name="inline-flex [&>svg]:h-5 [&>svg]:w-5" />
      Filters
    </button>

    <div
      id="resource-filter-panel"
      :class="isMobilePanelOpen ? 'block' : 'hidden'"
      class="flex flex-col gap-6 lg:block"
    >
      <fieldset v-if="topicsGroup" class="flex flex-col gap-3 border border-border-default p-5">
        <legend class="px-1 text-sm font-bold text-text-default">{{ topicsGroup.legend }}</legend>
        <label
          v-for="option in topicsGroup.options"
          :key="option.id"
          class="flex items-center gap-2.5 text-sm text-text-default"
        >
          <input
            type="checkbox"
            :checked="selectedTopics.has(option.id)"
            class="h-4 w-4 rounded border-border-strong text-brand-primary focus-visible:ring-brand-primary"
            @change="$emit('toggle-topic', option.id)"
          />
          {{ option.label }}
        </label>
      </fieldset>

      <fieldset v-if="formatsGroup" class="flex flex-col gap-3 border border-border-default p-5">
        <legend class="px-1 text-sm font-bold text-text-default">{{ formatsGroup.legend }}</legend>
        <label
          v-for="option in formatsGroup.options"
          :key="option.id"
          class="flex items-center gap-2.5 text-sm text-text-default"
        >
          <input
            type="checkbox"
            :checked="selectedFormats.has(option.id)"
            class="h-4 w-4 rounded border-border-strong text-brand-primary focus-visible:ring-brand-primary"
            @change="$emit('toggle-format', option.id)"
          />
          {{ option.label }}
        </label>
      </fieldset>
    </div>
  </aside>
</template>
