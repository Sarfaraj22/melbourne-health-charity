<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useGetSupportContent } from '@/composables/useGetSupportContent'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Get Support', to: '/get-support' },
  { label: 'Live Chat' },
]
const { chatHeading, chatIntro, chatUnavailable } = useGetSupportContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero :heading="chatHeading" :intro="chatIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col items-start gap-4">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
        >
          <AppIcon :svg="messageCircleIcon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
        </span>
        <AppButton
          type="button"
          variant="primary"
          disabled
          aria-describedby="live-chat-unavailable"
        >
          Start live chat
        </AppButton>
        <p id="live-chat-unavailable" class="max-w-xl text-sm text-text-subtle">
          {{ chatUnavailable }}
        </p>
        <AppButton variant="secondary" to="/contact">Go to contact</AppButton>
      </div>
    </section>
  </div>
</template>
