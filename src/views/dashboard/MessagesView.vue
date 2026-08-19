<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import MessageThreadPanel from '@/components/messaging/MessageThreadPanel.vue'
import { useLiveChat, isCustomerLiveChatSender } from '@/composables/useLiveChat'
import { useMessageThreads } from '@/composables/useMessageThreads'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'

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
  selfUid,
  selectThread,
  sendReply,
} = useMessageThreads('self')

const {
  phase,
  guestName,
  guestEmail,
  draft: liveDraft,
  chat,
  messages: liveMessages,
  startError,
  sendError: liveSendError,
  starting,
  sending: liveSending,
  startChat,
  sendMessage,
} = useLiveChat('user-dashboard')
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Messages">
    <div class="flex flex-col gap-10">
      <section class="flex flex-col gap-4" aria-labelledby="user-internal-chat-heading">
        <h2 id="user-internal-chat-heading" class="text-lg font-bold text-text-default">
          Messages
        </h2>
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
          @select="selectThread"
          @update:draft="draft = $event"
          @send="sendReply"
        />
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="user-live-chat-heading">
        <div class="flex items-center gap-2">
          <AppIcon
            :svg="messageCircleIcon"
            class-name="text-brand-primary [&>svg]:h-5 [&>svg]:w-5"
          />
          <h2 id="user-live-chat-heading" class="text-lg font-bold text-text-default">Live chat</h2>
        </div>
        <p class="text-sm text-text-muted">
          Chat with our volunteer support team. A coordinator will step in if no one is available.
        </p>

        <form
          v-if="phase === 'start'"
          class="flex max-w-xl flex-col gap-3"
          novalidate
          @submit.prevent="startChat"
        >
          <p v-if="startError" class="text-sm text-brand-donate" role="alert">{{ startError }}</p>
          <AppButton type="submit" :disabled="starting">
            {{ starting ? 'Starting...' : 'Start live chat' }}
          </AppButton>
        </form>

        <div v-else class="flex max-w-xl flex-col gap-3">
          <p class="text-sm text-text-muted">
            Chatting as {{ guestName }} ({{ guestEmail }}).
            <span v-if="chat?.data.status === 'closed'">This chat is closed.</span>
          </p>
          <ul
            class="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-md border border-border-default p-4"
          >
            <li v-if="liveMessages.length === 0" class="text-sm text-text-muted">
              Send a message and our team will reply here.
            </li>
            <li
              v-for="message in liveMessages"
              :key="message.id"
              class="flex flex-col gap-1 rounded-md p-3"
              :class="
                isCustomerLiveChatSender(message.data.sender)
                  ? 'bg-surface-muted'
                  : 'border border-border-default'
              "
            >
              <span class="text-xs font-bold text-text-subtle">
                {{ isCustomerLiveChatSender(message.data.sender) ? 'You' : 'Support' }}
                · {{ formatMillisAsDdMmYyyy(message.data.createdAt) }}
              </span>
              <span class="text-sm text-text-default">{{ message.data.body }}</span>
            </li>
          </ul>
          <p v-if="liveSendError" class="text-sm text-brand-donate" role="alert">
            {{ liveSendError }}
          </p>
          <form
            v-if="chat?.data.status !== 'closed'"
            class="flex flex-col gap-2"
            @submit.prevent="sendMessage"
          >
            <label for="user-live-chat-message" class="text-sm font-medium text-text-default">
              Message
            </label>
            <textarea
              id="user-live-chat-message"
              v-model="liveDraft"
              rows="3"
              required
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
            <AppButton type="submit" :disabled="liveSending || liveDraft.trim().length === 0">
              {{ liveSending ? 'Sending...' : 'Send' }}
            </AppButton>
          </form>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
