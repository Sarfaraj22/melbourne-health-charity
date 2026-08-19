<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import type { MessageThreadListItem } from '@/composables/useMessageThreads'
import type { ThreadMessageDoc } from '@/types/firestore'
import type { WithId } from '@/services/firebase/firestore.service'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly threads: readonly MessageThreadListItem[]
  readonly selectedId: string
  readonly messages: readonly WithId<ThreadMessageDoc>[]
  readonly selfUid: string
  readonly draft: string
  readonly sending: boolean
  readonly sendError: string
  readonly emptyListMessage: string
  readonly canReply: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [threadId: string]
  'update:draft': [value: string]
  send: []
}>()

function onDraftInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLTextAreaElement) {
    emit('update:draft', target.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-1.5">
      <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:h-3 [&>svg]:w-3" />
      <p class="text-xs text-text-subtle">End-to-end encrypted</p>
    </div>

    <div v-if="props.threads.length === 0" class="rounded-md border border-border-default p-5">
      <p class="text-sm text-text-muted">{{ props.emptyListMessage }}</p>
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-3">
      <ul
        class="flex flex-col divide-y divide-border-default rounded-md border border-border-default"
      >
        <li v-for="thread in props.threads" :key="thread.id">
          <button
            type="button"
            class="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            :class="props.selectedId === thread.id ? 'bg-surface-muted' : ''"
            @click="emit('select', thread.id)"
          >
            <span class="text-sm font-bold text-text-default">{{ thread.counterpartName }}</span>
            <span class="text-xs text-text-subtle">{{
              formatMillisAsDdMmYyyy(thread.updatedAt)
            }}</span>
          </button>
        </li>
      </ul>

      <div class="flex flex-col gap-3 lg:col-span-2">
        <p v-if="props.selectedId.length === 0" class="text-sm text-text-muted">
          Select a conversation to reply.
        </p>
        <template v-else>
          <ul
            class="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-md border border-border-default p-4"
          >
            <li v-if="props.messages.length === 0" class="text-sm text-text-muted">
              No messages in this conversation yet.
            </li>
            <li
              v-for="message in props.messages"
              :key="message.id"
              class="flex flex-col gap-1 rounded-md p-3"
              :class="
                message.data.senderUid === props.selfUid
                  ? 'bg-surface-muted'
                  : 'border border-border-default'
              "
            >
              <span class="text-xs font-bold text-text-subtle">
                {{ message.data.senderUid === props.selfUid ? 'You' : message.data.sender }}
                · {{ formatMillisAsDdMmYyyy(message.data.createdAt) }}
              </span>
              <span class="text-sm text-text-default">{{ message.data.body }}</span>
            </li>
          </ul>
          <p v-if="props.sendError" class="text-sm text-brand-donate" role="alert">
            {{ props.sendError }}
          </p>
          <form v-if="props.canReply" class="flex flex-col gap-2" @submit.prevent="emit('send')">
            <label for="thread-reply" class="text-sm font-medium text-text-default">Reply</label>
            <textarea
              id="thread-reply"
              :value="props.draft"
              rows="3"
              required
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="onDraftInput"
            />
            <AppButton type="submit" :disabled="props.sending || props.draft.trim().length === 0">
              {{ props.sending ? 'Sending...' : 'Send reply' }}
            </AppButton>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
