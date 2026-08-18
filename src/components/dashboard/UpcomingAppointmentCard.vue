<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { useUserDashboardData } from '@/composables/useUserDashboardData'

const { upcomingAppointment } = useUserDashboardData()
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="upcoming-appointment-heading">
    <div class="mx-auto max-w-container">
      <div class="flex flex-col gap-4 rounded-md border border-border-default bg-surface p-6">
        <h2 id="upcoming-appointment-heading" class="text-lg font-bold text-text-default">
          Upcoming Appointment
        </h2>

        <p v-if="upcomingAppointment === undefined" class="text-sm text-text-muted">
          You have no upcoming appointments.
          <router-link
            to="/get-support/book-appointment"
            class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Book an appointment
          </router-link>
          to get started.
        </p>

        <template v-else>
          <dl class="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div class="flex flex-wrap gap-3">
            <AppButton variant="primary" size="sm" to="/dashboard/appointments"
              >View details</AppButton
            >
            <AppButton variant="secondary" size="sm" to="/get-support/book-appointment"
              >Reschedule</AppButton
            >
            <AppButton variant="secondary" size="sm" to="/dashboard/appointments">Cancel</AppButton>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
