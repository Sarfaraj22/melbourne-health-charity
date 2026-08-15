<script setup lang="ts">
import { computed } from 'vue'
import ServiceBreadcrumb from '@/components/services/ServiceBreadcrumb.vue'
import ServiceInfoSection from '@/components/services/ServiceInfoSection.vue'
import ServiceInfoGrid from '@/components/services/ServiceInfoGrid.vue'
import BookingFormCard from '@/components/services/BookingFormCard.vue'
import EligibilityCheckerCard from '@/components/services/EligibilityCheckerCard.vue'
import NeedHelpSection from '@/components/services/NeedHelpSection.vue'
import type { BreadcrumbItem, ServiceDetail } from '@/types/service'

interface Props {
  readonly detail: ServiceDetail
  readonly crumbs: readonly BreadcrumbItem[]
}

const props = defineProps<Props>()

const infoSectionHeading = computed((): string | undefined =>
  props.detail.variant === 'eligibility-checker' ? 'Eligibility Checker' : undefined,
)
</script>

<template>
  <div class="bg-surface">
    <ServiceBreadcrumb :crumbs="crumbs" />

    <div class="mx-auto max-w-container px-5 py-12 sm:px-8">
      <h1 v-if="detail.variant !== 'info'" class="sr-only">{{ detail.title }}</h1>

      <div v-if="detail.variant === 'info'" class="min-w-0">
        <ServiceInfoGrid :service="detail" />
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
    </div>

    <NeedHelpSection />
  </div>
</template>
