<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import VolunteerBenefits from '@/components/volunteer/VolunteerBenefits.vue'
import VolunteerHero from '@/components/volunteer/VolunteerHero.vue'
import VolunteerSubpageNav from '@/components/volunteer/VolunteerSubpageNav.vue'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Volunteer' }]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <VolunteerHero />
    <VolunteerSubpageNav />
    <VolunteerBenefits />
  </div>
</template>
