<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerApplicationForm from '@/components/volunteer/VolunteerApplicationForm.vue'
import VolunteerBecomeIntro from '@/components/volunteer/VolunteerBecomeIntro.vue'
import VolunteerSteps from '@/components/volunteer/VolunteerSteps.vue'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Become a Volunteer' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerBecomeIntro />
    <VolunteerSteps />
    <VolunteerApplicationForm />
  </div>
</template>
