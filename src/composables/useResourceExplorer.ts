import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { ResourceFormatId, ResourceItem, ResourceTopicId } from '@/types/resource'
import { useResourcesContent } from '@/composables/useResourcesContent'

export interface UseResourceExplorerReturn {
  readonly resources: readonly ResourceItem[]
  readonly searchQuery: Ref<string>
  readonly selectedTopics: Ref<ReadonlySet<ResourceTopicId>>
  readonly selectedFormats: Ref<ReadonlySet<ResourceFormatId>>
  readonly currentPage: Ref<number>
  readonly pageSize: number
  readonly filteredResources: ComputedRef<readonly ResourceItem[]>
  readonly paginatedResources: ComputedRef<readonly ResourceItem[]>
  readonly totalPages: ComputedRef<number>
  readonly resultCount: ComputedRef<number>
  readonly hasActiveFilters: ComputedRef<boolean>
  isTopicSelected: (id: ResourceTopicId) => boolean
  isFormatSelected: (id: ResourceFormatId) => boolean
  setSearchQuery: (value: string) => void
  toggleTopic: (id: ResourceTopicId) => void
  toggleFormat: (id: ResourceFormatId) => void
  clearFilters: () => void
  goToPage: (page: number) => void
}

export const RESOURCE_PAGE_SIZE = 6

export function useResourceExplorer(): UseResourceExplorerReturn {
  const { resources } = useResourcesContent()

  const searchQuery = ref('')
  const selectedTopics = ref<ReadonlySet<ResourceTopicId>>(new Set())
  const selectedFormats = ref<ReadonlySet<ResourceFormatId>>(new Set())
  const currentPage = ref(1)
  const pageSize = RESOURCE_PAGE_SIZE

  const filteredResources = computed<readonly ResourceItem[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const topics = selectedTopics.value
    const formats = selectedFormats.value

    return resources.filter((resource) => {
      const matchesQuery =
        query === '' ||
        resource.title.toLowerCase().includes(query) ||
        resource.summary.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)

      const matchesTopics = topics.size === 0 || resource.topics.some((topic) => topics.has(topic))

      const matchesFormats =
        formats.size === 0 || resource.formats.some((format) => formats.has(format))

      return matchesQuery && matchesTopics && matchesFormats
    })
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredResources.value.length / pageSize)),
  )

  const paginatedResources = computed<readonly ResourceItem[]>(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredResources.value.slice(start, start + pageSize)
  })

  const resultCount = computed(() => filteredResources.value.length)

  const hasActiveFilters = computed(
    () =>
      searchQuery.value.trim() !== '' ||
      selectedTopics.value.size > 0 ||
      selectedFormats.value.size > 0,
  )

  function isTopicSelected(id: ResourceTopicId): boolean {
    return selectedTopics.value.has(id)
  }

  function isFormatSelected(id: ResourceFormatId): boolean {
    return selectedFormats.value.has(id)
  }

  function setSearchQuery(value: string): void {
    searchQuery.value = value
    currentPage.value = 1
  }

  function toggleTopic(id: ResourceTopicId): void {
    const next = new Set(selectedTopics.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedTopics.value = next
    currentPage.value = 1
  }

  function toggleFormat(id: ResourceFormatId): void {
    const next = new Set(selectedFormats.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedFormats.value = next
    currentPage.value = 1
  }

  function clearFilters(): void {
    searchQuery.value = ''
    selectedTopics.value = new Set()
    selectedFormats.value = new Set()
    currentPage.value = 1
  }

  function goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), totalPages.value)
    currentPage.value = target
  }

  watch(
    () => filteredResources.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
    },
  )

  return {
    resources,
    searchQuery,
    selectedTopics,
    selectedFormats,
    currentPage,
    pageSize,
    filteredResources,
    paginatedResources,
    totalPages,
    resultCount,
    hasActiveFilters,
    isTopicSelected,
    isFormatSelected,
    setSearchQuery,
    toggleTopic,
    toggleFormat,
    clearFilters,
    goToPage,
  }
}
