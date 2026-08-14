<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'
import { useVolunteerOpportunities } from '@/composables/useVolunteerOpportunities'
import searchIcon from '@/assets/icons/search.svg?raw'

const { filterGroups } = useVolunteerContent()
const {
  searchQuery,
  filteredOpportunities,
  resultCount,
  hasActiveFilters,
  isCategorySelected,
  setSearchQuery,
  toggleCategory,
  clearFilters,
} = useVolunteerOpportunities()

const categoryGroup = filterGroups[0]
</script>

<template>
  <section
    aria-labelledby="volunteer-opportunities-heading"
    class="bg-surface-muted px-5 py-14 sm:px-8"
  >
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-opportunities-heading" class="sr-only">Available roles</h2>

      <form role="search" class="flex w-full max-w-2xl flex-col gap-3 sm:flex-row" @submit.prevent>
        <label class="sr-only" for="volunteer-opportunities-search">Search opportunities</label>
        <div class="relative flex-1">
          <AppIcon
            :svg="searchIcon"
            class-name="pointer-events-none absolute left-4 top-1/2 inline-flex -translate-y-1/2 text-text-subtle [&>svg]:h-5 [&>svg]:w-5"
          />
          <input
            id="volunteer-opportunities-search"
            type="search"
            name="volunteer-opportunities-search"
            placeholder="Search roles (e.g. events, companionship, admin)"
            :value="searchQuery"
            class="w-full rounded border border-border-strong bg-surface py-3 pl-12 pr-4 text-base text-text-default placeholder:text-text-subtle focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @input="setSearchQuery(($event.target as HTMLInputElement).value)"
          />
        </div>
      </form>

      <fieldset v-if="categoryGroup" class="flex flex-col gap-2">
        <legend class="sr-only">{{ categoryGroup.legend }}</legend>
        <ul class="flex flex-wrap gap-2">
          <li v-for="option in categoryGroup.options" :key="option.id">
            <button
              type="button"
              :aria-pressed="isCategorySelected(option.id)"
              :class="[
                'rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                isCategorySelected(option.id)
                  ? 'bg-brand-primary text-text-on-brand'
                  : 'border border-border-default bg-surface text-text-default',
              ]"
              @click="toggleCategory(option.id)"
            >
              {{ option.label }}
            </button>
          </li>
        </ul>
      </fieldset>

      <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-text-muted" aria-live="polite">
          {{ resultCount }} role{{ resultCount === 1 ? '' : 's' }} found
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <ul v-if="filteredOpportunities.length > 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="opportunity in filteredOpportunities" :key="opportunity.id">
          <BaseCard interactive class="h-full">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
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
            <AppButton variant="secondary" size="sm" to="/volunteer/become-a-volunteer">
              Apply now
            </AppButton>
          </BaseCard>
        </li>
      </ul>

      <div
        v-else
        class="flex flex-col items-center gap-4 rounded-lg border border-border-default bg-surface px-6 py-14 text-center"
      >
        <p class="text-base font-medium text-text-default">No roles match your search.</p>
        <p class="max-w-md text-sm text-text-muted">
          Try adjusting your search terms or clearing your filters to see more opportunities.
        </p>
        <AppButton v-if="hasActiveFilters" variant="secondary" @click="clearFilters">
          Clear filters
        </AppButton>
      </div>
    </div>
  </section>
</template>
