<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { createInboxMessage } from '@/services/firebase/firestore.service'
import type { AdminInboxThread, AdminMessage, AdminProfile } from '@/types/admin'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly messages: readonly AdminMessage[]
  readonly inboxMessages: readonly AdminInboxThread[]
  readonly profiles: readonly AdminProfile[]
}

const props = defineProps<Props>()

const composeOpen = ref<boolean>(false)
const recipientUid = ref<string>('')
const body = ref<string>('')
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref<string>('')

const recipients = computed<readonly AdminProfile[]>(() =>
  props.profiles.filter((profile) => profile.role !== 'admin'),
)

function selectedProfile(): AdminProfile | undefined {
  return recipients.value.find((profile) => profile.uid === recipientUid.value)
}

async function handleCompose(): Promise<void> {
  status.value = 'submitting'
  errorMessage.value = ''
  const profile = selectedProfile()
  if (profile === undefined) {
    status.value = 'error'
    errorMessage.value = 'Please choose a recipient.'
    return
  }
  if (body.value.trim().length === 0) {
    status.value = 'error'
    errorMessage.value = 'Please enter a message.'
    return
  }
  try {
    await createInboxMessage({
      userId: profile.uid,
      sender: 'Support Team',
      body: body.value.trim(),
      fromRole: 'admin',
      createdAt: Date.now(),
    })
    body.value = ''
    status.value = 'success'
  } catch {
    status.value = 'error'
    errorMessage.value = 'Unable to send this message.'
  }
}

function toggleCompose(): void {
  composeOpen.value = !composeOpen.value
  status.value = 'idle'
  errorMessage.value = ''
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-messages-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex flex-col gap-4 rounded-md border border-border-default p-5">
        <div class="flex items-center justify-between gap-4">
          <h2 id="admin-messages-heading" class="text-lg font-bold text-text-default">
            Messages &amp; Enquiries
          </h2>
          <AppButton type="button" variant="primary" size="sm" @click="toggleCompose">
            Compose
          </AppButton>
        </div>

        <div class="flex items-center gap-1.5">
          <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:h-3 [&>svg]:w-3" />
          <p class="text-xs text-text-subtle">End-to-end encrypted</p>
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
              v-model="body"
              rows="4"
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
          </div>
          <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
            {{ errorMessage }}
          </p>
          <p v-if="status === 'success'" class="text-sm text-status-success" role="status">
            Message sent.
          </p>
          <AppButton type="submit" :disabled="status === 'submitting'">
            {{ status === 'submitting' ? 'Sending...' : 'Send message' }}
          </AppButton>
        </form>

        <h3 class="text-sm font-bold text-text-default">Dashboard inbox</h3>
        <div v-if="inboxMessages.length === 0" class="py-3 text-center">
          <p class="text-sm text-text-muted">No dashboard messages yet.</p>
        </div>
        <ul v-else class="flex flex-col divide-y divide-border-default">
          <li v-for="item in inboxMessages" :key="item.id" class="flex flex-col gap-1 py-3">
            <p class="text-sm font-bold text-text-default">
              {{ item.sender }}
              <span class="font-medium text-text-subtle">({{ item.fromRole }})</span>
            </p>
            <p class="text-sm text-text-muted">{{ item.body }}</p>
            <p class="text-xs text-text-subtle">{{ formatMillisAsDdMmYyyy(item.createdAt) }}</p>
          </li>
        </ul>

        <h3 class="text-sm font-bold text-text-default">Contact enquiries</h3>
        <div v-if="messages.length === 0" class="py-3 text-center">
          <p class="text-sm text-text-muted">No contact enquiries yet.</p>
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
