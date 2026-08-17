<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import type { AdminMessage } from '@/types/admin'

interface Props {
  readonly messages: readonly AdminMessage[]
}

defineProps<Props>()
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-messages-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex flex-col gap-4 rounded-md border border-border-default p-5">
        <div class="flex items-center justify-between gap-4">
          <h2 id="admin-messages-heading" class="text-lg font-bold text-text-default">
            Messages &amp; Enquiries
          </h2>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded bg-brand-primary px-4 py-2 text-sm font-bold text-text-on-brand hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Compose
          </button>
        </div>

        <div class="flex items-center gap-1.5">
          <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:h-3 [&>svg]:w-3" />
          <p class="text-xs text-text-subtle">End-to-end encrypted</p>
        </div>

        <div v-if="messages.length === 0" class="py-3 text-center">
          <p class="text-sm text-text-muted">No messages yet.</p>
        </div>

        <ul v-else class="flex flex-col divide-y divide-border-default">
          <li v-for="message in messages" :key="message.id" class="flex flex-col gap-1 py-3">
            <p class="text-sm font-bold text-text-default">{{ message.sender }}</p>
            <p class="text-sm text-text-muted">{{ message.preview }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
