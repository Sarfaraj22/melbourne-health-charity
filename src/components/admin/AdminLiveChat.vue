<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import xIcon from '@/assets/icons/x.svg?raw'
import {
  addLiveChatMessage,
  subscribeLiveChatMessages,
  updateLiveChatStatus,
  type WithId,
} from '@/services/firebase/firestore.service'
import { isCustomerLiveChatSender } from '@/composables/useLiveChat'
import type { AdminLiveChatThread } from '@/types/admin'
import type { LiveChatMessageDoc, LiveChatSender } from '@/types/firestore'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly chats: readonly AdminLiveChatThread[]
}

const props = defineProps<Props>()

const selectedId = ref<string>('')
const messages = ref<readonly WithId<LiveChatMessageDoc>[]>([])
const lastSenderById = ref<Readonly<Record<string, LiveChatSender | ''>>>({})
const draft = ref<string>('')
const sendError = ref<string>('')
const sending = ref<boolean>(false)

let unsubMessages: (() => void) | undefined
const previewUnsubs = new Map<string, () => void>()

const selectedChat = computed<AdminLiveChatThread | undefined>(() =>
  props.chats.find((chat) => chat.id === selectedId.value),
)

const sortedMessages = computed<readonly WithId<LiveChatMessageDoc>[]>(() =>
  messages.value.slice().sort((left, right) => left.data.createdAt - right.data.createdAt),
)

function isUnanswered(chatId: string): boolean {
  const lastSender = lastSenderById.value[chatId]
  if (lastSender === undefined || lastSender === '') {
    return true
  }
  return isCustomerLiveChatSender(lastSender)
}

function senderLabel(sender: LiveChatSender, guestName: string): string {
  if (sender === 'admin') {
    return 'Admin'
  }
  if (sender === 'volunteer') {
    return 'Volunteer'
  }
  return guestName
}

function clearPreviewSubscriptions(): void {
  for (const unsubscribe of previewUnsubs.values()) {
    unsubscribe()
  }
  previewUnsubs.clear()
}

watch(
  () => props.chats,
  (records) => {
    const ids = new Set(records.map((record) => record.id))
    for (const [id, unsubscribe] of previewUnsubs) {
      if (!ids.has(id)) {
        unsubscribe()
        previewUnsubs.delete(id)
      }
    }
    for (const record of records) {
      if (previewUnsubs.has(record.id)) {
        continue
      }
      const chatId = record.id
      const unsubscribe = subscribeLiveChatMessages(chatId, (items) => {
        const latest = items
          .slice()
          .sort((left, right) => left.data.createdAt - right.data.createdAt)
          .at(-1)
        lastSenderById.value = {
          ...lastSenderById.value,
          [chatId]: latest === undefined ? '' : latest.data.sender,
        }
      })
      previewUnsubs.set(chatId, unsubscribe)
    }
  },
  { immediate: true, deep: false },
)

watch(
  selectedId,
  (chatId) => {
    if (unsubMessages !== undefined) {
      unsubMessages()
      unsubMessages = undefined
    }
    messages.value = []
    if (chatId.length === 0) {
      return
    }
    unsubMessages = subscribeLiveChatMessages(chatId, (records) => {
      messages.value = records
    })
  },
  { immediate: true, deep: false },
)

onUnmounted(() => {
  if (unsubMessages !== undefined) {
    unsubMessages()
  }
  clearPreviewSubscriptions()
})

function selectChat(id: string): void {
  selectedId.value = id
  sendError.value = ''
}

async function sendReply(): Promise<void> {
  const chatId = selectedId.value
  const body = draft.value.trim()
  if (chatId.length === 0 || body.length === 0) {
    return
  }
  sending.value = true
  sendError.value = ''
  try {
    await addLiveChatMessage(chatId, {
      sender: 'admin',
      body,
      createdAt: Date.now(),
    })
    draft.value = ''
  } catch {
    sendError.value = 'Unable to send this reply.'
  } finally {
    sending.value = false
  }
}

async function closeChat(): Promise<void> {
  const chatId = selectedId.value
  if (chatId.length === 0) {
    return
  }
  try {
    await updateLiveChatStatus(chatId, 'closed')
  } catch {
    sendError.value = 'Unable to close this chat.'
  }
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-live-chat-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="admin-live-chat-heading" class="text-2xl font-bold text-text-default">Live Chat</h2>
      <p class="text-sm text-text-muted">
        Volunteers reply first. Unanswered chats are those waiting on a visitor or member message.
      </p>
      <div
        v-if="chats.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No live chat sessions yet.</p>
      </div>
      <div v-else class="grid gap-4 lg:grid-cols-3">
        <ul
          class="flex flex-col divide-y divide-border-default rounded-md border border-border-default"
        >
          <li v-for="chat in chats" :key="chat.id">
            <button
              type="button"
              class="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              :class="selectedId === chat.id ? 'bg-surface-muted' : ''"
              @click="selectChat(chat.id)"
            >
              <span class="text-sm font-bold text-text-default">{{ chat.guestName }}</span>
              <span class="text-xs text-text-muted">{{ chat.guestEmail }}</span>
              <span class="text-xs text-text-subtle">
                {{ chat.origin === 'registered' ? 'Registered' : 'Visitor' }}
                · {{ chat.status === 'open' ? 'Open' : 'Closed' }}
                <template v-if="isUnanswered(chat.id)"> · Unanswered</template>
              </span>
            </button>
          </li>
        </ul>
        <div class="flex flex-col gap-3 lg:col-span-2">
          <p v-if="selectedChat === undefined" class="text-sm text-text-muted">
            Select a conversation to reply.
          </p>
          <template v-else>
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-bold text-text-default">
                {{ selectedChat.guestName }} · {{ selectedChat.guestEmail }}
              </p>
              <div class="flex items-center gap-2">
                <AppButton
                  v-if="selectedChat.status === 'open'"
                  type="button"
                  variant="secondary"
                  size="xs"
                  @click="closeChat"
                >
                  Close chat
                </AppButton>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-text-subtle hover:bg-surface-muted hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  aria-label="Close conversation"
                  @click="selectChat('')"
                >
                  <AppIcon :svg="xIcon" class-name="[&>svg]:h-4 [&>svg]:w-4" />
                </button>
              </div>
            </div>
            <ul
              class="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-md border border-border-default p-4"
            >
              <li
                v-for="message in sortedMessages"
                :key="message.id"
                class="flex flex-col gap-1 rounded-md p-3"
                :class="
                  message.data.sender === 'admin' || message.data.sender === 'volunteer'
                    ? 'bg-surface-muted'
                    : 'border border-border-default'
                "
              >
                <span class="text-xs font-bold text-text-subtle">
                  {{ senderLabel(message.data.sender, selectedChat.guestName) }}
                  · {{ formatMillisAsDdMmYyyy(message.data.createdAt) }}
                </span>
                <span class="text-sm text-text-default">{{ message.data.body }}</span>
              </li>
            </ul>
            <p v-if="sendError" class="text-sm text-brand-donate" role="alert">{{ sendError }}</p>
            <form
              v-if="selectedChat.status === 'open'"
              class="flex flex-col gap-2"
              @submit.prevent="sendReply"
            >
              <label for="admin-live-chat-reply" class="text-sm font-medium text-text-default">
                Reply
              </label>
              <textarea
                id="admin-live-chat-reply"
                v-model="draft"
                rows="3"
                required
                class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
              <AppButton type="submit" :disabled="sending || draft.trim().length === 0">
                {{ sending ? 'Sending...' : 'Send reply' }}
              </AppButton>
            </form>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
