<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerFaqs from '@/components/volunteer/VolunteerFaqs.vue'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Volunteer FAQs' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerFaqs />
  </div>
</template>
