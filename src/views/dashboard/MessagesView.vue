<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import MessageThreadPanel from '@/components/messaging/MessageThreadPanel.vue'
import { useMessageThreads } from '@/composables/useMessageThreads'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Messages' },
]

const {
  threads,
  selectedId,
  messages,
  draft,
  sending,
  sendError,
  listError,
  selfUid,
  selectThread,
  sendReply,
} = useMessageThreads('self')
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Messages">
    <section class="flex flex-col gap-4" aria-labelledby="user-internal-chat-heading">
      <h2 id="user-internal-chat-heading" class="text-lg font-bold text-text-default">Messages</h2>
      <p v-if="listError" class="text-sm text-brand-donate" role="alert">{{ listError }}</p>
      <MessageThreadPanel
        :threads="threads"
        :selected-id="selectedId"
        :messages="messages"
        :self-uid="selfUid"
        :draft="draft"
        :sending="sending"
        :send-error="sendError"
        empty-list-message="You have no conversations yet. Staff will write to you here."
        :can-reply="true"
        :can-collapse="true"
        @select="selectThread"
        @update:draft="draft = $event"
        @send="sendReply"
        @close="selectThread('')"
      />
    </section>
  </DashboardLayout>
</template>
