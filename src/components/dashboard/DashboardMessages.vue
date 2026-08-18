<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useUserDashboardData } from '@/composables/useUserDashboardData'

const { messages } = useUserDashboardData()
</script>

<template>
  <section class="flex flex-col gap-4" aria-labelledby="dashboard-messages-heading">
    <div class="flex items-center justify-between gap-2">
      <h2 id="dashboard-messages-heading" class="text-lg font-bold text-text-default">Messages</h2>
      <router-link
        to="/dashboard/messages"
        class="text-sm font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        View all
      </router-link>
    </div>

    <div class="flex items-center gap-1.5">
      <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:h-3 [&>svg]:w-3" />
      <p class="text-xs text-text-subtle">End-to-end encrypted</p>
    </div>

    <p v-if="messages.length === 0" class="text-sm text-text-muted">You have no messages yet.</p>
    <ul v-else class="flex flex-col divide-y divide-border-default">
      <li v-for="message in messages" :key="message.id" class="flex flex-col gap-1 py-3">
        <p class="text-sm font-bold text-text-default">{{ message.sender }}</p>
        <p class="text-sm text-text-muted">{{ message.preview }}</p>
      </li>
    </ul>
  </section>
</template>
