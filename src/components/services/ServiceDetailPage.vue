<script setup lang="ts">
import { computed } from 'vue'
import ServiceBreadcrumb from '@/components/services/ServiceBreadcrumb.vue'
import ServiceInfoSection from '@/components/services/ServiceInfoSection.vue'
import ServiceInfoGrid from '@/components/services/ServiceInfoGrid.vue'
import ServiceReviewsList from '@/components/services/ServiceReviewsList.vue'
import BookingFormCard from '@/components/services/BookingFormCard.vue'
import EligibilityCheckerCard from '@/components/services/EligibilityCheckerCard.vue'
import NeedHelpSection from '@/components/services/NeedHelpSection.vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { BreadcrumbItem, ServiceDetail } from '@/types/service'

interface Props {
  readonly detail: ServiceDetail
  readonly crumbs: readonly BreadcrumbItem[]
}

const props = defineProps<Props>()

const infoSectionHeading = computed((): string | undefined =>
  props.detail.variant === 'eligibility-checker' ? 'Eligibility Checker' : undefined,
)

const activities = computed((): readonly string[] => props.detail.activities ?? [])

const showReviews = computed<boolean>(() => props.detail.variant === 'booking')
</script>

<template>
  <div class="bg-surface">
    <ServiceBreadcrumb :crumbs="crumbs" />

    <div class="mx-auto flex max-w-container flex-col gap-10 px-5 py-12 sm:px-8">
      <div v-if="detail.variant === 'info'" class="flex min-w-0 flex-col gap-10">
        <ServiceInfoGrid :service="detail" />

        <section
          v-if="activities.length > 0"
          aria-labelledby="service-activities-heading"
          class="flex flex-col gap-5"
        >
          <h2 id="service-activities-heading" class="text-2xl font-bold text-text-default">
            Activities
          </h2>
          <ul class="flex list-disc flex-col gap-2 pl-5 text-base text-text-default">
            <li v-for="activity in activities" :key="activity">{{ activity }}</li>
          </ul>
          <AppButton to="/events" variant="secondary" class="self-start">
            See upcoming events
          </AppButton>
        </section>
      </div>

      <div v-else class="grid grid-cols-1 gap-10 lg:flex lg:items-start lg:gap-10">
        <div class="min-w-0 flex-1">
          <ServiceInfoSection :service="detail" :heading="infoSectionHeading" />
        </div>
        <div class="lg:w-96 lg:shrink-0">
          <EligibilityCheckerCard v-if="detail.variant === 'eligibility-checker'" />
          <BookingFormCard v-else :initial-service-slug="detail.slug" />
        </div>
      </div>

      <ServiceReviewsList v-if="showReviews" :service-slug="detail.slug" />
    </div>

    <NeedHelpSection />
  </div>
</template>
