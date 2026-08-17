<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppIcon from '@/components/ui/AppIcon.vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useDashboardContent } from '@/composables/useDashboardContent'

const { content } = useDashboardContent()
const messages = content.messages

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

      <ul
        class="flex flex-col divide-y divide-border-default rounded-md border border-border-default bg-surface"
      >
        <li v-for="message in messages" :key="message.id" class="flex flex-col gap-1 p-5">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-bold text-text-default">{{ message.sender }}</p>
            <p class="text-xs text-text-subtle">{{ message.receivedAt }}</p>
          </div>
          <p class="text-sm text-text-muted">{{ message.preview }}</p>
        </li>
      </ul>
    </div>
  </DashboardLayout>
</template>
