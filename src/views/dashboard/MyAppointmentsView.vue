<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const appointment = content.upcomingAppointment

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'My Appointments' },
]
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="My Appointments">
    <div class="flex flex-col gap-4 rounded-md border border-border-default bg-surface p-6">
      <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Next appointment</p>
      <dl class="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Service</dt>
          <dd class="text-base text-text-default">{{ appointment.service }}</dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Date</dt>
          <dd class="text-base text-text-default">{{ appointment.date }}</dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Time</dt>
          <dd class="text-base text-text-default">{{ appointment.time }}</dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Location</dt>
          <dd class="text-base text-text-default">{{ appointment.location }}</dd>
        </div>
      </dl>
      <p class="text-sm text-text-muted">
        Need to change this appointment? Visit
        <router-link
          to="/get-support/book-appointment"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Book an Appointment
        </router-link>
        to reschedule.
      </p>
    </div>
  </DashboardLayout>
</template>
