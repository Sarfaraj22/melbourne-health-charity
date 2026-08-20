import { computed, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  subscribeServiceReviewsForSlug,
  subscribeServiceReviewsForUser,
  upsertServiceReview,
  type WithId,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import type { ServiceReviewDoc } from '@/types/firestore'

export interface UseUserServiceReviewsReturn {
  readonly reviewsBySlug: ComputedRef<ReadonlyMap<string, WithId<ServiceReviewDoc>>>
  readonly status: Ref<'idle' | 'submitting' | 'success' | 'error'>
  readonly errorMessage: Ref<string>
  submitReview: (
    serviceSlug: string,
    appointmentId: string,
    rating: number,
    comment: string,
  ) => Promise<void>
}

export interface UsePublicServiceReviewsReturn {
  readonly reviews: ComputedRef<readonly WithId<ServiceReviewDoc>[]>
  readonly averageRating: ComputedRef<number>
  readonly reviewCount: ComputedRef<number>
}

function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

export function useUserServiceReviews(): UseUserServiceReviewsReturn {
  const authStore = useAuthStore()
  const records = ref<readonly WithId<ServiceReviewDoc>[]>([])
  const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const errorMessage = ref<string>('')
  let unsubscribe: (() => void) | undefined

  function clearSubscription(): void {
    if (unsubscribe !== undefined) {
      unsubscribe()
      unsubscribe = undefined
    }
  }

  watch(
    () => authStore.user?.uid,
    (uid) => {
      clearSubscription()
      records.value = []
      if (uid === undefined) {
        return
      }
      unsubscribe = subscribeServiceReviewsForUser(
        uid,
        (next) => {
          records.value = next
        },
        () => {
          records.value = []
        },
      )
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    clearSubscription()
  })

  const reviewsBySlug = computed((): ReadonlyMap<string, WithId<ServiceReviewDoc>> => {
    const map = new Map<string, WithId<ServiceReviewDoc>>()
    for (const record of records.value) {
      map.set(record.data.serviceSlug, record)
    }
    return map
  })

  async function submitReview(
    serviceSlug: string,
    appointmentId: string,
    rating: number,
    comment: string,
  ): Promise<void> {
    status.value = 'submitting'
    errorMessage.value = ''
    const user = authStore.user
    if (user === undefined) {
      status.value = 'error'
      errorMessage.value = 'You need to be signed in to leave a review.'
      return
    }
    if (!isValidRating(rating)) {
      status.value = 'error'
      errorMessage.value = 'Please choose a rating from 1 to 5.'
      return
    }
    const trimmedComment = comment.trim()
    if (trimmedComment.length > 1000) {
      status.value = 'error'
      errorMessage.value = 'Please keep your review to 1000 characters or fewer.'
      return
    }
    try {
      await upsertServiceReview({
        userId: user.uid,
        displayName: user.displayName.length > 0 ? user.displayName : 'Member',
        serviceSlug,
        appointmentId,
        rating,
        comment: trimmedComment,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      status.value = 'success'
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to save your review. Please try again.'
    }
  }

  return {
    reviewsBySlug,
    status,
    errorMessage,
    submitReview,
  }
}

export function usePublicServiceReviews(serviceSlug: () => string): UsePublicServiceReviewsReturn {
  const records = ref<readonly WithId<ServiceReviewDoc>[]>([])
  let unsubscribe: (() => void) | undefined

  function clearSubscription(): void {
    if (unsubscribe !== undefined) {
      unsubscribe()
      unsubscribe = undefined
    }
  }

  watch(
    serviceSlug,
    (slug) => {
      clearSubscription()
      records.value = []
      if (slug.length === 0) {
        return
      }
      unsubscribe = subscribeServiceReviewsForSlug(
        slug,
        (next) => {
          records.value = next
        },
        () => {
          records.value = []
        },
      )
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    clearSubscription()
  })

  const reviews = computed((): readonly WithId<ServiceReviewDoc>[] =>
    records.value.slice().sort((left, right) => right.data.updatedAt - left.data.updatedAt),
  )

  const reviewCount = computed((): number => reviews.value.length)

  const averageRating = computed((): number => {
    if (reviews.value.length === 0) {
      return 0
    }
    const total = reviews.value.reduce((sum, record) => sum + record.data.rating, 0)
    return total / reviews.value.length
  })

  return {
    reviews,
    averageRating,
    reviewCount,
  }
}
