import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  saveResource,
  subscribeSavedResourcesForUser,
  unsaveResource,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'

export interface UseSavedResourcesStoreReturn {
  readonly savedIds: ReadonlySet<string>
  readonly count: Readonly<number>
  isSaved: (id: string) => boolean
  toggle: (id: string) => Promise<void>
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useSavedResourcesStore = defineStore(
  'saved-resources',
  (): UseSavedResourcesStoreReturn => {
    const authStore = useAuthStore()
    const savedIds = ref<ReadonlySet<string>>(new Set())
    let unsubscribeSaved: (() => void) | undefined

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

    function clear(): void {
      savedIds.value = new Set()
    }

    async function toggle(id: string): Promise<void> {
      const uid = authStore.user?.uid
      if (uid === undefined) {
        const next = new Set(savedIds.value)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        savedIds.value = next
        return
      }

      if (savedIds.value.has(id)) {
        await unsaveResource(uid, id)
        return
      }
      await saveResource(uid, id)
    }

    watch(
      () => authStore.user?.uid,
      (uid) => {
        if (unsubscribeSaved !== undefined) {
          unsubscribeSaved()
          unsubscribeSaved = undefined
        }
        if (uid === undefined) {
          savedIds.value = new Set()
          return
        }
        unsubscribeSaved = subscribeSavedResourcesForUser(uid, (records) => {
          savedIds.value = new Set(records.map((record) => record.data.resourceId))
        })
      },
      { immediate: true, deep: false },
    )

    return { savedIds, count, isSaved, toggle, add, remove, clear }
  },
)
