<script setup lang="ts">
import MessageThreadPanel from '@/components/messaging/MessageThreadPanel.vue'
import { useMessageThreads } from '@/composables/useMessageThreads'

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
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="dashboard-messages-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="dashboard-messages-heading" class="text-lg font-bold text-text-default">Messages</h2>
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
    </div>
  </section>
</template>
