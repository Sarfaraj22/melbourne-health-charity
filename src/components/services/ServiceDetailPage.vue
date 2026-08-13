<script setup lang="ts">
import ServiceBreadcrumb from '@/components/services/ServiceBreadcrumb.vue'
import ServiceInfoSection from '@/components/services/ServiceInfoSection.vue'
import BookingFormCard from '@/components/services/BookingFormCard.vue'
import NeedHelpSection from '@/components/services/NeedHelpSection.vue'
import type { BreadcrumbItem, ServiceDetail } from '@/types/service'

interface Props {
  readonly detail: ServiceDetail
  readonly crumbs: readonly BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-surface">
    <ServiceBreadcrumb :crumbs="crumbs" />

    <div class="mx-auto max-w-container px-5 py-12 sm:px-8">
      <h1 class="sr-only">{{ detail.title }}</h1>
      <div class="grid grid-cols-1 gap-10 lg:flex lg:items-start lg:gap-10">
        <div class="min-w-0 flex-1">
          <ServiceInfoSection :service="detail" />
        </div>
        <div class="lg:w-96 lg:shrink-0">
          <BookingFormCard :service-title="detail.title" />
        </div>
      </div>
    </div>

    <NeedHelpSection />
  </div>
</template>
