import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface UseSavedResourcesStoreReturn {
  readonly savedIds: ReadonlySet<string>
  readonly count: Readonly<number>
  isSaved: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useSavedResourcesStore = defineStore(
  'saved-resources',
  (): UseSavedResourcesStoreReturn => {
    const savedIds = ref<ReadonlySet<string>>(new Set())

    const count = computed(() => savedIds.value.size)

    function isSaved(id: string): boolean {
      return savedIds.value.has(id)
    }

    function add(id: string): void {
      if (savedIds.value.has(id)) return
      const next = new Set(savedIds.value)
      next.add(id)
      savedIds.value = next
    }

    function remove(id: string): void {
      if (!savedIds.value.has(id)) return
      const next = new Set(savedIds.value)
      next.delete(id)
      savedIds.value = next
    }

    function toggle(id: string): void {
      const next = new Set(savedIds.value)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      savedIds.value = next
    }

    function clear(): void {
      savedIds.value = new Set()
    }

    return { savedIds, count, isSaved, toggle, add, remove, clear }
  },
)
