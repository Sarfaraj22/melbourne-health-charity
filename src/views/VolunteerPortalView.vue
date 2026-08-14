<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerDashboardHeading from '@/components/volunteer/VolunteerDashboardHeading.vue'
import VolunteerDashboardOpportunities from '@/components/volunteer/VolunteerDashboardOpportunities.vue'
import VolunteerMessages from '@/components/volunteer/VolunteerMessages.vue'
import VolunteerSummaryCards from '@/components/volunteer/VolunteerSummaryCards.vue'
import VolunteerUpcomingEvents from '@/components/volunteer/VolunteerUpcomingEvents.vue'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Volunteer Portal' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerDashboardHeading />
    <VolunteerSummaryCards />
    <VolunteerUpcomingEvents />
    <VolunteerDashboardOpportunities />
    <VolunteerMessages />
  </div>
</template>
