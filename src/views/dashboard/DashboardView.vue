<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import DashboardGreeting from '@/components/dashboard/DashboardGreeting.vue'
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard.vue'
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
    <section class="bg-surface px-5 py-6 sm:px-8">
      <div class="mx-auto grid max-w-container grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardMessages />
        <DashboardSavedResources />
      </div>
    </section>
    <DashboardUpcomingEvents />
    <DashboardProfileSettings />
  </div>
</template>
