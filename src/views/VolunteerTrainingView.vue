<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerTrainingGrid from '@/components/volunteer/VolunteerTrainingGrid.vue'
import VolunteerTrainingIntro from '@/components/volunteer/VolunteerTrainingIntro.vue'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Training Resources' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerTrainingIntro />
    <VolunteerTrainingGrid />
  </div>
</template>
