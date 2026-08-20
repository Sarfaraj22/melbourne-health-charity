<script setup lang="ts">
import { computed } from 'vue'
import ServiceRatingStars from '@/components/ui/ServiceRatingStars.vue'
import { usePublicServiceReviews } from '@/composables/useServiceReviews'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly serviceSlug: string
}

const props = defineProps<Props>()

const { reviews, averageRating, reviewCount } = usePublicServiceReviews(
  (): string => props.serviceSlug,
)

const averageLabel = computed<string>(() => {
  if (reviewCount.value === 0) {
    return 'No reviews yet'
  }
  return `${averageRating.value.toFixed(1)} out of 5 (${reviewCount.value} review${
    reviewCount.value === 1 ? '' : 's'
  })`
})

const roundedAverage = computed<number>(() => Math.round(averageRating.value))
</script>

<template>
  <section class="flex flex-col gap-4" aria-labelledby="service-reviews-heading">
    <h2 id="service-reviews-heading" class="text-2xl font-bold text-text-default">
      Reviews and ratings
    </h2>
    <div class="flex flex-col gap-2">
      <ServiceRatingStars :rating="roundedAverage" />
      <p class="text-sm text-text-muted">{{ averageLabel }}</p>
    </div>
    <p v-if="reviews.length === 0" class="text-sm text-text-muted">
      Be the first to review this service after your appointment.
    </p>
    <ul v-else class="flex flex-col gap-3">
      <li
        v-for="review in reviews"
        :key="review.id"
        class="flex flex-col gap-2 rounded-md border border-border-default p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-bold text-text-default">{{ review.data.displayName }}</p>
          <p class="text-xs text-text-subtle">
            {{ formatMillisAsDdMmYyyy(review.data.updatedAt) }}
          </p>
        </div>
        <ServiceRatingStars :rating="review.data.rating" />
        <p v-if="review.data.comment.length > 0" class="text-sm text-text-default">
          {{ review.data.comment }}
        </p>
      </li>
    </ul>
  </section>
</template>
