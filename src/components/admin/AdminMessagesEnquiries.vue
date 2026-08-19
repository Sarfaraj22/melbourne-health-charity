<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import MessageThreadPanel from '@/components/messaging/MessageThreadPanel.vue'
import { useMessageThreads } from '@/composables/useMessageThreads'
import type { AdminProfile } from '@/types/admin'

interface Props {
  readonly profiles: readonly AdminProfile[]
}

const props = defineProps<Props>()

const {
  threads,
  selectedId,
  messages,
  draft,
  sending,
  sendError,
  composeError,
  selfUid,
  selectThread,
  sendReply,
  startThreadWith,
} = useMessageThreads('admin')

const composeOpen = ref<boolean>(false)
const recipientUid = ref<string>('')
const composeBody = ref<string>('')
const composeStatus = ref<'idle' | 'submitting' | 'success'>('idle')

const recipients = computed<readonly AdminProfile[]>(() =>
  props.profiles.filter((profile) => profile.role !== 'admin'),
)

function toggleCompose(): void {
  composeOpen.value = !composeOpen.value
  composeStatus.value = 'idle'
}

async function handleCompose(): Promise<void> {
  composeStatus.value = 'submitting'
  const threadId = await startThreadWith(recipientUid.value, composeBody.value)
  if (threadId === undefined) {
    composeStatus.value = 'idle'
    return
  }
  composeBody.value = ''
  composeStatus.value = 'success'
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-internal-chat-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex flex-col gap-4 rounded-md border border-border-default p-5">
        <div class="flex items-center justify-between gap-4">
          <h2 id="admin-internal-chat-heading" class="text-lg font-bold text-text-default">
            Internal Chat
          </h2>
          <AppButton type="button" variant="primary" size="sm" @click="toggleCompose">
            Compose
          </AppButton>
        </div>

        <form
          v-if="composeOpen"
          class="flex flex-col gap-3 rounded-md border border-border-default p-4"
          novalidate
          @submit.prevent="handleCompose"
        >
          <div class="flex flex-col gap-1.5">
            <label for="compose-recipient" class="text-sm font-medium text-text-default">
              Recipient
            </label>
            <select
              id="compose-recipient"
              v-model="recipientUid"
              required
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <option value="" disabled>Select a person</option>
              <option v-for="profile in recipients" :key="profile.uid" :value="profile.uid">
                {{ profile.displayName }} ({{ profile.email }}) · {{ profile.role }}
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="compose-body" class="text-sm font-medium text-text-default">Message</label>
            <textarea
              id="compose-body"
              v-model="composeBody"
              rows="4"
              required
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
          </div>
          <p v-if="composeError" class="text-sm text-brand-donate" role="alert">
            {{ composeError }}
          </p>
          <p v-if="composeStatus === 'success'" class="text-sm text-status-success" role="status">
            Message sent.
          </p>
          <AppButton type="submit" :disabled="composeStatus === 'submitting'">
            {{ composeStatus === 'submitting' ? 'Sending...' : 'Send message' }}
          </AppButton>
        </form>

        <MessageThreadPanel
          :threads="threads"
          :selected-id="selectedId"
          :messages="messages"
          :self-uid="selfUid"
          :draft="draft"
          :sending="sending"
          :send-error="sendError"
          empty-list-message="No internal conversations yet. Compose a message to start one."
          :can-reply="true"
          @select="selectThread"
          @update:draft="draft = $event"
          @send="sendReply"
        />
      </div>
    </div>
  </section>
</template>
