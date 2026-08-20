import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

export type AdminTableSortDirection = 'asc' | 'desc'

export interface UseAdminDataTableOptions<T> {
  readonly rows: () => readonly T[]
  readonly searchFields: readonly (keyof T)[]
  readonly pageSize?: number
  readonly defaultSortKey?: string
  readonly defaultSortDirection?: AdminTableSortDirection
  readonly getSortValue: (row: T, key: string) => string | number
}

export interface UseAdminDataTableReturn<T> {
  readonly searchQuery: Ref<string>
  readonly sortKey: Ref<string>
  readonly sortDirection: Ref<AdminTableSortDirection>
  readonly page: Ref<number>
  readonly pageSize: number
  readonly filteredRows: ComputedRef<readonly T[]>
  readonly pagedRows: ComputedRef<readonly T[]>
  readonly totalFiltered: ComputedRef<number>
  readonly totalPages: ComputedRef<number>
  readonly rangeStart: ComputedRef<number>
  readonly rangeEnd: ComputedRef<number>
  setSearchQuery: (value: string) => void
  toggleSort: (key: string) => void
  goToPage: (nextPage: number) => void
  ariaSortFor: (key: string) => 'ascending' | 'descending' | 'none'
}

const DEFAULT_PAGE_SIZE = 10

function fieldText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }
  return ''
}

function compareSortValues(left: string | number, right: string | number): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }
  return String(left).localeCompare(String(right), 'en-AU', { sensitivity: 'base' })
}

export function useAdminDataTable<T>(
  options: UseAdminDataTableOptions<T>,
): UseAdminDataTableReturn<T> {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const searchQuery = ref<string>('')
  const sortKey = ref<string>(options.defaultSortKey ?? '')
  const sortDirection = ref<AdminTableSortDirection>(options.defaultSortDirection ?? 'asc')
  const page = ref<number>(1)

  const filteredRows = computed((): readonly T[] => {
    const query = searchQuery.value.trim().toLowerCase()
    const source = options.rows()
    const searched =
      query.length === 0
        ? source
        : source.filter((row) =>
            options.searchFields.some((field) =>
              fieldText(row[field]).toLowerCase().includes(query),
            ),
          )

    if (sortKey.value.length === 0) {
      return searched
    }

    const key = sortKey.value
    const direction = sortDirection.value === 'asc' ? 1 : -1
    return searched.slice().sort((left, right) => {
      return (
        compareSortValues(options.getSortValue(left, key), options.getSortValue(right, key)) *
        direction
      )
    })
  })

  const totalFiltered = computed((): number => filteredRows.value.length)

  const totalPages = computed((): number => {
    if (totalFiltered.value === 0) {
      return 1
    }
    return Math.ceil(totalFiltered.value / pageSize)
  })

  const pagedRows = computed((): readonly T[] => {
    const start = (page.value - 1) * pageSize
    return filteredRows.value.slice(start, start + pageSize)
  })

  const rangeStart = computed((): number => {
    if (totalFiltered.value === 0) {
      return 0
    }
    return (page.value - 1) * pageSize + 1
  })

  const rangeEnd = computed((): number => Math.min(page.value * pageSize, totalFiltered.value))

  watch(
    totalPages,
    (pages: number): void => {
      if (page.value > pages) {
        page.value = pages
      }
    },
    { immediate: true, deep: false },
  )

  function setSearchQuery(value: string): void {
    searchQuery.value = value
    page.value = 1
  }

  function toggleSort(key: string): void {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDirection.value = 'asc'
    }
    page.value = 1
  }

  function goToPage(nextPage: number): void {
    if (nextPage < 1 || nextPage > totalPages.value) {
      return
    }
    page.value = nextPage
  }

  function ariaSortFor(key: string): 'ascending' | 'descending' | 'none' {
    if (sortKey.value !== key) {
      return 'none'
    }
    return sortDirection.value === 'asc' ? 'ascending' : 'descending'
  }

  return {
    searchQuery,
    sortKey,
    sortDirection,
    page,
    pageSize,
    filteredRows,
    pagedRows,
    totalFiltered,
    totalPages,
    rangeStart,
    rangeEnd,
    setSearchQuery,
    toggleSort,
    goToPage,
    ariaSortFor,
  }
}
