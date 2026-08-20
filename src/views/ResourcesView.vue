<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import ResourceSearchHero from '@/components/resources/ResourceSearchHero.vue'
import ResourceFilterSidebar from '@/components/resources/ResourceFilterSidebar.vue'
import ResourceGrid from '@/components/resources/ResourceGrid.vue'
import ResourcePagination from '@/components/resources/ResourcePagination.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import searchIcon from '@/assets/icons/search.svg?raw'
import { useResourcesContent } from '@/composables/useResourcesContent'
import { useResourceExplorer } from '@/composables/useResourceExplorer'
import { useSavedResourcesStore } from '@/stores/savedResources.store'
import { usePartnerServices } from '@/composables/usePartnerServices'
import PartnerServicesMap from '@/components/resources/PartnerServicesMap.vue'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Resources' }]

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
const { services: partnerServices } = usePartnerServices()

function onToggleSave(id: string): void {
  void savedStore.toggle(id)
}

function onSearchInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setSearchQuery(target.value)
  }
}
</script>

<template>
  <div class="bg-surface">
    <AppBreadcrumb :crumbs="crumbs" />
    <ResourceSearchHero :saved-count="savedCount" />

    <section
      class="mx-auto max-w-container px-5 py-14 sm:px-8"
      aria-labelledby="partner-services-heading"
    >
      <div class="flex flex-col gap-4">
        <h2 id="partner-services-heading" class="text-2xl font-bold text-text-default">
          Other Melbourne disability services
        </h2>
        <p class="max-w-3xl text-sm text-text-muted">
          Melbourne Health Charity does not duplicate these specialist organisations. Use the map
          and contact details below to find local advocacy, therapy, and community supports.
        </p>
        <PartnerServicesMap :services="partnerServices" />
      </div>
    </section>

    <section
      class="mx-auto max-w-container px-5 pb-14 sm:px-8"
      aria-labelledby="resource-library-heading"
    >
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <h2 id="resource-library-heading" class="text-2xl font-bold text-text-default">
            Guides, articles, and videos
          </h2>
          <form
            role="search"
            class="flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
            @submit.prevent
          >
            <label class="sr-only" for="resource-search">Search resources</label>
            <div class="relative flex-1">
              <AppIcon
                :svg="searchIcon"
                class-name="pointer-events-none absolute left-4 top-1/2 inline-flex -translate-y-1/2 text-text-subtle [&>svg]:h-5 [&>svg]:w-5"
              />
              <input
                id="resource-search"
                type="search"
                name="resource-search"
                placeholder="Search resources (e.g. mental health, NDIS, mobility)"
                :value="searchQuery"
                class="w-full rounded border border-border-strong bg-surface py-3 pl-12 pr-4 text-base text-text-default placeholder:text-text-subtle focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                @input="onSearchInput"
              />
            </div>
            <AppButton type="submit" variant="primary" class="sm:self-start">Search</AppButton>
          </form>
        </div>

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
      </div>
    </section>
  </div>
</template>
