<script setup lang="ts">
import { computed } from 'vue'
import ResourceSearchHero from '@/components/resources/ResourceSearchHero.vue'
import ResourceFilterSidebar from '@/components/resources/ResourceFilterSidebar.vue'
import ResourceGrid from '@/components/resources/ResourceGrid.vue'
import ResourcePagination from '@/components/resources/ResourcePagination.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useResourcesContent } from '@/composables/useResourcesContent'
import { useResourceExplorer } from '@/composables/useResourceExplorer'
import { useSavedResourcesStore } from '@/stores/savedResources.store'

const { filterGroups } = useResourcesContent()
const savedStore = useSavedResourcesStore()
const {
  searchQuery,
  selectedTopics,
  selectedFormats,
  currentPage,
  paginatedResources,
  totalPages,
  resultCount,
  hasActiveFilters,
  setSearchQuery,
  toggleTopic,
  toggleFormat,
  clearFilters,
  goToPage,
} = useResourceExplorer()

const savedIds = computed(() => savedStore.savedIds)
const savedCount = computed(() => savedStore.count)

function onToggleSave(id: string): void {
  savedStore.toggle(id)
}
</script>

<template>
  <div class="bg-surface">
    <ResourceSearchHero
      :model-value="searchQuery"
      :saved-count="savedCount"
      @update:model-value="setSearchQuery"
    />

    <section class="mx-auto max-w-container px-5 py-14 sm:px-8">
      <div class="flex flex-col gap-10 lg:flex-row">
        <div class="lg:w-64 lg:shrink-0">
          <ResourceFilterSidebar
            :filter-groups="filterGroups"
            :selected-topics="selectedTopics"
            :selected-formats="selectedFormats"
            :has-active-filters="hasActiveFilters"
            @toggle-topic="toggleTopic"
            @toggle-format="toggleFormat"
            @clear-filters="clearFilters"
          />
        </div>

        <div class="flex flex-1 flex-col gap-8">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-text-muted" aria-live="polite">
              {{ resultCount }} resource{{ resultCount === 1 ? '' : 's' }} found
            </p>
          </div>

          <ResourceGrid
            v-if="paginatedResources.length > 0"
            :resources="paginatedResources"
            :saved-ids="savedIds"
            @toggle-save="onToggleSave"
          />

          <div
            v-else
            class="flex flex-col items-center gap-4 rounded-lg border border-border-default bg-surface-muted px-6 py-14 text-center"
          >
            <p class="text-base font-medium text-text-default">No resources match your search.</p>
            <p class="max-w-md text-sm text-text-muted">
              Try adjusting your search terms or clearing your filters to see more resources.
            </p>
            <AppButton v-if="hasActiveFilters" variant="secondary" @click="clearFilters">
              Clear filters
            </AppButton>
          </div>

          <ResourcePagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @go-to-page="goToPage"
          />
        </div>
      </div>
    </section>
  </div>
</template>
