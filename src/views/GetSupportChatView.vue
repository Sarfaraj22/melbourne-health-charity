<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useGetSupportContent } from '@/composables/useGetSupportContent'
import { useLiveChat } from '@/composables/useLiveChat'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Get Support', to: '/get-support' },
  { label: 'Live Chat' },
]
const { chatHeading, chatIntro } = useGetSupportContent()
const {
  phase,
  guestName,
  guestEmail,
  draft,
  chat,
  messages,
  startError,
  sendError,
  starting,
  sending,
  startChat,
  sendMessage,
} = useLiveChat()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero :heading="chatHeading" :intro="chatIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-xl flex-col gap-4">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
        >
          <AppIcon :svg="messageCircleIcon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
        </span>

        <form
          v-if="phase === 'start'"
          class="flex flex-col gap-4"
          novalidate
          @submit.prevent="startChat"
        >
          <div class="flex flex-col gap-1.5">
            <label for="live-chat-name" class="text-sm font-medium text-text-default">Name</label>
            <input
              id="live-chat-name"
              v-model="guestName"
              type="text"
              autocomplete="name"
              required
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="live-chat-email" class="text-sm font-medium text-text-default">Email</label>
            <input
              id="live-chat-email"
              v-model="guestEmail"
              type="email"
              autocomplete="email"
              required
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
          </div>
          <p v-if="startError" class="text-sm text-brand-accent" role="alert">{{ startError }}</p>
          <AppButton type="submit" variant="primary" :disabled="starting">
            {{ starting ? 'Starting...' : 'Start live chat' }}
          </AppButton>
        </form>

        <div v-else class="flex flex-col gap-4">
          <p class="text-sm text-text-muted">
            Chatting as {{ guestName }} ({{ guestEmail }}).
            <span v-if="chat?.data.status === 'closed'">This chat is closed.</span>
          </p>
          <ul
            class="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-md border border-border-default p-4"
          >
            <li v-if="messages.length === 0" class="text-sm text-text-muted">
              Send a message and our team will reply here.
            </li>
            <li
              v-for="message in messages"
              :key="message.id"
              class="flex flex-col gap-1 rounded-md p-3"
              :class="
                message.data.sender === 'guest'
                  ? 'bg-surface-muted'
                  : 'border border-border-default'
              "
            >
              <span class="text-xs font-bold text-text-subtle">
                {{ message.data.sender === 'guest' ? 'You' : 'Support' }}
                · {{ formatMillisAsDdMmYyyy(message.data.createdAt) }}
              </span>
              <span class="text-sm text-text-default">{{ message.data.body }}</span>
            </li>
          </ul>
          <p v-if="sendError" class="text-sm text-brand-accent" role="alert">{{ sendError }}</p>
          <form
            v-if="chat?.data.status !== 'closed'"
            class="flex flex-col gap-2"
            @submit.prevent="sendMessage"
          >
            <label for="live-chat-message" class="text-sm font-medium text-text-default">
              Message
            </label>
            <textarea
              id="live-chat-message"
              v-model="draft"
              rows="3"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
            <AppButton
              type="submit"
              variant="primary"
              :disabled="sending || draft.trim().length === 0"
            >
              {{ sending ? 'Sending...' : 'Send' }}
            </AppButton>
          </form>
          <AppButton variant="secondary" to="/contact">Go to contact</AppButton>
        </div>
      </div>
    </section>
  </div>
</template>
