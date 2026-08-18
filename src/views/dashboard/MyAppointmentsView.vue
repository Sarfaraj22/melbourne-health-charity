<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import type { AppCalendarEvent } from '@/types/calendar'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useUserDashboardData } from '@/composables/useUserDashboardData'
import { toCalendarEvent } from '@/utils/datetime'

const AppCalendar = defineAsyncComponent(() => import('@/components/ui/AppCalendar.vue'))

const { appointments, upcomingAppointment } = useUserDashboardData()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'My Appointments' },
]

const calendarEvents = computed((): readonly AppCalendarEvent[] => {
  const mapped: AppCalendarEvent[] = []
  for (const appointment of appointments.value) {
    const event = toCalendarEvent(appointment.service, appointment.date, appointment.time)
    if (event !== undefined) {
      mapped.push(event)
    }
  }
  return mapped
})
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="My Appointments">
    <div class="flex flex-col gap-6">
      <AppCalendar :events="calendarEvents" />
      <p v-if="upcomingAppointment === undefined" class="text-base text-text-muted">
        You have no upcoming appointments.
        <router-link
          to="/get-support/book-appointment"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Book an appointment
        </router-link>
      </p>
      <div
        v-else
        class="flex flex-col gap-4 rounded-md border border-border-default bg-surface p-6"
      >
        <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Next appointment</p>
        <dl class="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Service</dt>
            <dd class="text-base text-text-default">{{ upcomingAppointment.service }}</dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Date</dt>
            <dd class="text-base text-text-default">{{ upcomingAppointment.date }}</dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Time</dt>
            <dd class="text-base text-text-default">{{ upcomingAppointment.time }}</dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">Location</dt>
            <dd class="text-base text-text-default">{{ upcomingAppointment.location }}</dd>
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
    </div>
  </DashboardLayout>
</template>
