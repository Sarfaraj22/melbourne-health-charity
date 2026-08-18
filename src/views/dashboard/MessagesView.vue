<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useInboxReply } from '@/composables/useInboxReply'
import { useUserDashboardData } from '@/composables/useUserDashboardData'

const { messages } = useUserDashboardData()
const { draft, status, errorMessage, send } = useInboxReply('user')

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Messages' },
]
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Messages">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-1.5">
        <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:h-3 [&>svg]:w-3" />
        <p class="text-xs text-text-subtle">End-to-end encrypted</p>
      </div>

      <p v-if="messages.length === 0" class="text-sm text-text-muted">You have no messages yet.</p>
      <ul
        v-else
        class="flex flex-col divide-y divide-border-default rounded-md border border-border-default bg-surface"
      >
        <li v-for="message in messages" :key="message.id" class="flex flex-col gap-1 p-5">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-bold text-text-default">{{ message.sender }}</p>
            <p class="text-xs text-text-subtle">{{ message.receivedAt }}</p>
          </div>
          <p class="text-sm text-text-muted">{{ message.body }}</p>
        </li>
      </ul>

      <form class="flex max-w-xl flex-col gap-2" novalidate @submit.prevent="send">
        <label for="user-message-reply" class="text-sm font-medium text-text-default">Reply</label>
        <textarea
          id="user-message-reply"
          v-model="draft"
          rows="3"
          class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        />
        <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
          {{ errorMessage }}
        </p>
        <p v-if="status === 'success'" class="text-sm text-status-success" role="status">
          Reply sent.
        </p>
        <AppButton type="submit" :disabled="status === 'submitting'">
          {{ status === 'submitting' ? 'Sending...' : 'Send reply' }}
        </AppButton>
      </form>
    </div>
  </DashboardLayout>
</template>
