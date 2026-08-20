<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import xIcon from '@/assets/icons/x.svg?raw'
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
  readonly showThreadList?: boolean
  readonly canCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showThreadList: true,
  canCollapse: false,
})

const emit = defineEmits<{
  select: [threadId: string]
  'update:draft': [value: string]
  send: []
  close: []
}>()

const replyField = ref<HTMLTextAreaElement | null>(null)

watch(
  () => props.selectedId,
  async (threadId) => {
    if (threadId.length === 0 || !props.canReply) {
      return
    }
    await nextTick()
    replyField.value?.focus()
  },
  { immediate: false, deep: false },
)

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

    <div
      v-if="props.showThreadList && props.threads.length === 0"
      class="rounded-md border border-border-default p-5"
    >
      <p class="text-sm text-text-muted">{{ props.emptyListMessage }}</p>
    </div>

    <div v-else class="grid gap-4" :class="props.showThreadList ? 'lg:grid-cols-3' : 'grid-cols-1'">
      <ul
        v-if="props.showThreadList"
        class="flex flex-col divide-y divide-border-default overflow-x-auto rounded-md border border-border-default"
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

      <div class="flex flex-col gap-3" :class="props.showThreadList ? 'lg:col-span-2' : ''">
        <p v-if="props.selectedId.length === 0" class="text-sm text-text-muted">
          Select a conversation to reply.
        </p>
        <template v-else>
          <div v-if="props.canCollapse" class="flex items-start justify-end">
            <button
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded text-text-subtle hover:bg-surface-muted hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Close conversation"
              @click="emit('close')"
            >
              <AppIcon :svg="xIcon" class-name="[&>svg]:h-4 [&>svg]:w-4" />
            </button>
          </div>
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
            <label for="thread-reply" class="text-sm font-medium text-text-default">
              Reply <span class="font-normal text-text-subtle">(required)</span>
            </label>
            <textarea
              id="thread-reply"
              ref="replyField"
              :value="props.draft"
              rows="3"
              required
              aria-required="true"
              class="w-full rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
