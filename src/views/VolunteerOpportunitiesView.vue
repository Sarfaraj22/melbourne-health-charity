<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerCtaBand from '@/components/volunteer/VolunteerCtaBand.vue'
import VolunteerOpportunitiesExplorer from '@/components/volunteer/VolunteerOpportunitiesExplorer.vue'
import VolunteerPageHero from '@/components/volunteer/VolunteerPageHero.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { opportunitiesIntro } = useVolunteerContent()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Volunteer Opportunities' },
]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerPageHero heading="Volunteer Opportunities" :intro="opportunitiesIntro" />
    <VolunteerOpportunitiesExplorer />
    <VolunteerCtaBand
      heading="Ready to apply?"
      intro="Found a role that suits you? Start your application and a coordinator will be in touch."
      button-label="Become a volunteer"
      button-to="/volunteer/become-a-volunteer"
    />
  </div>
</template>
