<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import FormFieldLabel from '@/components/ui/FormFieldLabel.vue'
import ServiceRatingStars from '@/components/ui/ServiceRatingStars.vue'
import { useUserServiceReviews } from '@/composables/useServiceReviews'
import { useUserDashboardData } from '@/composables/useUserDashboardData'
import type { DashboardAccessedService } from '@/types/dashboard'

interface ReviewDraft {
  rating: number
  comment: string
}

const { accessedServices } = useUserDashboardData()
const { reviewsBySlug, status, errorMessage, submitReview } = useUserServiceReviews()

const drafts = reactive<Record<string, ReviewDraft>>({})
const lastAttemptedSlug = ref<string>('')
const lastSavedSlug = ref<string>('')

function ensureDraft(service: DashboardAccessedService): void {
  if (drafts[service.serviceSlug] !== undefined) {
    return
  }
  const saved = reviewsBySlug.value.get(service.serviceSlug)
  drafts[service.serviceSlug] = {
    rating: saved === undefined ? 0 : saved.data.rating,
    comment: saved === undefined ? '' : saved.data.comment,
  }
}

watch(
  accessedServices,
  (services) => {
    for (const service of services) {
      ensureDraft(service)
    }
  },
  { immediate: true, deep: false },
)

watch(
  reviewsBySlug,
  (map) => {
    for (const [slug, record] of map) {
      if (drafts[slug] !== undefined) {
        continue
      }
      drafts[slug] = { rating: record.data.rating, comment: record.data.comment }
    }
  },
  { immediate: true, deep: false },
)

function setRating(service: DashboardAccessedService, rating: number): void {
  ensureDraft(service)
  const draft = drafts[service.serviceSlug]
  if (draft === undefined) {
    return
  }
  draft.rating = rating
}

function cancelDraft(service: DashboardAccessedService): void {
  const saved = reviewsBySlug.value.get(service.serviceSlug)
  drafts[service.serviceSlug] = {
    rating: saved === undefined ? 0 : saved.data.rating,
    comment: saved === undefined ? '' : saved.data.comment,
  }
}

async function handleSubmit(service: DashboardAccessedService): Promise<void> {
  const draft = drafts[service.serviceSlug]
  if (draft === undefined) {
    return
  }
  lastAttemptedSlug.value = service.serviceSlug
  lastSavedSlug.value = ''
  await submitReview(service.serviceSlug, service.appointmentId, draft.rating, draft.comment)
  if (status.value === 'success') {
    lastSavedSlug.value = service.serviceSlug
  }
}

function hasExistingReview(serviceSlug: string): boolean {
  return reviewsBySlug.value.has(serviceSlug)
}

const reviewCards = computed(
  (): readonly {
    readonly service: DashboardAccessedService
    readonly draft: ReviewDraft
  }[] => {
    const cards: { readonly service: DashboardAccessedService; readonly draft: ReviewDraft }[] = []
    for (const service of accessedServices.value) {
      const draft = drafts[service.serviceSlug]
      if (draft === undefined) {
        continue
      }
      cards.push({ service, draft })
    }
    return cards
  },
)
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="user-service-reviews-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="user-service-reviews-heading" class="text-lg font-bold text-text-default">
        Rate your services
      </h2>
      <p v-if="accessedServices.length === 0" class="text-sm text-text-muted">
        After you attend a booked appointment, you can rate that service here.
      </p>
      <ul v-else class="flex flex-col gap-4">
        <li
          v-for="card in reviewCards"
          :key="card.service.serviceSlug"
          class="flex flex-col gap-3 rounded-md border border-border-default p-5"
        >
          <p class="text-base font-bold text-text-default">{{ card.service.title }}</p>
          <form class="flex flex-col gap-3" novalidate @submit.prevent="handleSubmit(card.service)">
            <div class="flex flex-col gap-1.5">
              <p
                :id="`review-rating-${card.service.serviceSlug}`"
                class="text-sm font-medium text-text-default"
              >
                Rating <span class="font-normal text-text-subtle">(required)</span>
              </p>
              <ServiceRatingStars
                :rating="card.draft.rating"
                :interactive="true"
                :labelled-by="`review-rating-${card.service.serviceSlug}`"
                @select="setRating(card.service, $event)"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <FormFieldLabel
                :html-for="`review-comment-${card.service.serviceSlug}`"
                :required="false"
                size="md"
              >
                Review
              </FormFieldLabel>
              <textarea
                :id="`review-comment-${card.service.serviceSlug}`"
                v-model="card.draft.comment"
                rows="3"
                maxlength="1000"
                class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
            </div>
            <p
              v-if="status === 'error' && lastAttemptedSlug === card.service.serviceSlug"
              class="text-sm text-brand-donate"
              role="alert"
            >
              {{ errorMessage }}
            </p>
            <p
              v-if="status === 'success' && lastSavedSlug === card.service.serviceSlug"
              class="text-sm text-status-success"
              role="status"
            >
              Review saved.
            </p>
            <div class="flex flex-wrap gap-2">
              <AppButton type="submit" :disabled="status === 'submitting'">
                {{
                  status === 'submitting'
                    ? 'Saving...'
                    : hasExistingReview(card.service.serviceSlug)
                      ? 'Update review'
                      : 'Submit review'
                }}
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                :disabled="status === 'submitting'"
                @click="cancelDraft(card.service)"
              >
                Cancel
              </AppButton>
            </div>
          </form>
        </li>
      </ul>
    </div>
  </section>
</template>
