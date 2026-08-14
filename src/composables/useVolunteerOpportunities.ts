import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { VolunteerOpportunity, VolunteerOpportunityCategory } from '@/types/volunteer'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

export interface UseVolunteerOpportunitiesReturn {
  readonly opportunities: readonly VolunteerOpportunity[]
  readonly searchQuery: Ref<string>
  readonly selectedCategories: Ref<ReadonlySet<VolunteerOpportunityCategory>>
  readonly filteredOpportunities: ComputedRef<readonly VolunteerOpportunity[]>
  readonly resultCount: ComputedRef<number>
  readonly hasActiveFilters: ComputedRef<boolean>
  isCategorySelected: (id: VolunteerOpportunityCategory) => boolean
  setSearchQuery: (value: string) => void
  toggleCategory: (id: VolunteerOpportunityCategory) => void
  clearFilters: () => void
}

export function useVolunteerOpportunities(): UseVolunteerOpportunitiesReturn {
  const { opportunities } = useVolunteerContent()

  const searchQuery = ref('')
  const selectedCategories = ref<ReadonlySet<VolunteerOpportunityCategory>>(new Set())

  const filteredOpportunities = computed<readonly VolunteerOpportunity[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const categories = selectedCategories.value

    return opportunities.filter((opportunity) => {
      const matchesQuery =
        query === '' ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.description.toLowerCase().includes(query)

      const matchesCategories = categories.size === 0 || categories.has(opportunity.category)

      return matchesQuery && matchesCategories
    })
  })

  const resultCount = computed(() => filteredOpportunities.value.length)

  const hasActiveFilters = computed(
    () => searchQuery.value.trim() !== '' || selectedCategories.value.size > 0,
  )

  function isCategorySelected(id: VolunteerOpportunityCategory): boolean {
    return selectedCategories.value.has(id)
  }

  function setSearchQuery(value: string): void {
    searchQuery.value = value
  }

  function toggleCategory(id: VolunteerOpportunityCategory): void {
    const next = new Set(selectedCategories.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedCategories.value = next
  }

  function clearFilters(): void {
    searchQuery.value = ''
    selectedCategories.value = new Set()
  }

  watch(
    () => filteredOpportunities.value.length,
    () => {
      // Re-evaluation trigger only; no page state to reset for this explorer.
    },
  )

  return {
    opportunities,
    searchQuery,
    selectedCategories,
    filteredOpportunities,
    resultCount,
    hasActiveFilters,
    isCategorySelected,
    setSearchQuery,
    toggleCategory,
    clearFilters,
  }
}
