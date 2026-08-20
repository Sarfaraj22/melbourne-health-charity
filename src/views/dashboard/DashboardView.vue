<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import DashboardGreeting from '@/components/dashboard/DashboardGreeting.vue'
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard.vue'
import DashboardServiceReviews from '@/components/dashboard/DashboardServiceReviews.vue'
import UserLiveChat from '@/components/dashboard/UserLiveChat.vue'
import DashboardMessages from '@/components/dashboard/DashboardMessages.vue'
import DashboardSavedResources from '@/components/dashboard/DashboardSavedResources.vue'
import DashboardUpcomingEvents from '@/components/dashboard/DashboardUpcomingEvents.vue'
import DashboardProfileSettings from '@/components/dashboard/DashboardProfileSettings.vue'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'My Dashboard' }]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <DashboardGreeting />
    <UpcomingAppointmentCard />
    <DashboardServiceReviews />
    <UserLiveChat />
    <DashboardMessages />
    <DashboardSavedResources />
    <DashboardUpcomingEvents />
    <DashboardProfileSettings />
  </div>
</template>
