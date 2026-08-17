<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AdminKpiCards from '@/components/admin/AdminKpiCards.vue'
import AdminVolunteerTable from '@/components/admin/AdminVolunteerTable.vue'
import AdminEventTable from '@/components/admin/AdminEventTable.vue'
import AdminReportsAnalytics from '@/components/admin/AdminReportsAnalytics.vue'
import AdminMessagesEnquiries from '@/components/admin/AdminMessagesEnquiries.vue'
import AdminSecurityCompliance from '@/components/admin/AdminSecurityCompliance.vue'
import { useAdminDashboardData } from '@/composables/useAdminDashboardData'
import { useAuthStore } from '@/stores/auth.store'
import { deleteEvent, deleteVolunteer, updateEvent } from '@/services/firebase/firestore.service'

const authStore = useAuthStore()
const { loading, error, data } = useAdminDashboardData()

const firstName = computed<string>(() => {
  const displayName = authStore.user?.displayName
  if (displayName === undefined || displayName.length === 0) {
    return 'there'
  }
  return displayName.split(' ')[0] ?? displayName
})

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Admin Dashboard' }]

async function handlePublishEvent(id: string): Promise<void> {
  try {
    await updateEvent(id, { status: 'published' })
  } catch {
    // Error is surfaced via the onSnapshot listener; no console output.
  }
}

async function handleDeleteVolunteer(id: string): Promise<void> {
  try {
    await deleteVolunteer(id)
  } catch {
    // Error is surfaced via the onSnapshot listener; no console output.
  }
}

async function handleDeleteEvent(id: string): Promise<void> {
  try {
    await deleteEvent(id)
  } catch {
    // Error is surfaced via the onSnapshot listener; no console output.
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />

    <section class="bg-surface px-5 pb-2 pt-12 sm:px-8" aria-labelledby="admin-dashboard-heading">
      <div class="mx-auto flex max-w-container flex-col gap-2">
        <h1 id="admin-dashboard-heading" class="text-3xl font-bold text-text-default">
          Admin Dashboard
        </h1>
        <p class="text-base text-text-muted">
          Welcome back, {{ firstName }}! {{ data.greetingSubtitle }}
        </p>
      </div>
    </section>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-base text-text-muted">Loading admin dashboard...</p>
    </div>

    <div v-else-if="error" class="flex items-center justify-center py-20">
      <p class="text-base text-brand-donate">{{ error }}</p>
    </div>

    <div v-else class="flex flex-col">
      <AdminKpiCards :cards="data.kpiCards" />
      <AdminVolunteerTable :volunteers="data.volunteers" @delete="handleDeleteVolunteer" />
      <AdminEventTable
        :events="data.events"
        @publish="handlePublishEvent"
        @delete="handleDeleteEvent"
      />
      <AdminReportsAnalytics :chart-bars="data.chartBars" :metrics="data.reportMetrics" />
      <AdminMessagesEnquiries :messages="data.messages" />
      <AdminSecurityCompliance :features="data.complianceFeatures" />
    </div>
  </div>
</template>
