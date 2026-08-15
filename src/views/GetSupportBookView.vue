<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import BookingFormCard from '@/components/services/BookingFormCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useGetSupportContent } from '@/composables/useGetSupportContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Get Support', to: '/get-support' },
  { label: 'Book an Appointment' },
]
const { bookIntro } = useGetSupportContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Book an Appointment" :intro="bookIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6 lg:max-w-xl">
        <AppButton variant="secondary" to="/services" class="self-start">Browse services</AppButton>
        <BookingFormCard initial-service-slug="" />
      </div>
    </section>
  </div>
</template>
