<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const appointment = content.upcomingAppointment
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="upcoming-appointment-heading">
    <div class="mx-auto max-w-container">
      <div class="flex flex-col gap-4 rounded-md border border-border-default bg-surface p-6">
        <h2 id="upcoming-appointment-heading" class="text-lg font-bold text-text-default">
          Upcoming Appointment
        </h2>

        <dl class="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div class="flex flex-wrap gap-3">
          <AppButton variant="primary" size="sm" to="/dashboard/appointments"
            >View details</AppButton
          >
          <AppButton variant="secondary" size="sm" to="/dashboard/appointments"
            >Reschedule</AppButton
          >
          <AppButton variant="secondary" size="sm" to="/dashboard/appointments">Cancel</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>
