<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AdminBulkEmail from '@/components/admin/AdminBulkEmail.vue'
import AdminEmailAttachments from '@/components/admin/AdminEmailAttachments.vue'
import { useEmailAttachments } from '@/composables/useEmailAttachments'
import { sendDirectEmail } from '@/services/firebase/functions.service'
import type { AdminContactEnquiry, AdminEmailRecord, AdminVolunteer } from '@/types/admin'
import { assertNever } from '@/utils/assertNever'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

type EmailTab = 'inbox' | 'compose' | 'bulk' | 'contact'

interface Props {
  readonly emails: readonly AdminEmailRecord[]
  readonly contacts: readonly AdminContactEnquiry[]
  readonly volunteers: readonly AdminVolunteer[]
}

const props = defineProps<Props>()

const tab = ref<EmailTab>('inbox')
const toAddress = ref<string>('')
const subject = ref<string>('')
const body = ref<string>('')
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref<string>('')
const replyByContactId = ref<string>('')
const replySubject = ref<string>('')
const replyBody = ref<string>('')
const replyEmailId = ref<string>('')
const attachments = useEmailAttachments()

const sortedEmails = computed<readonly AdminEmailRecord[]>(() =>
  props.emails.slice().sort((left, right) => right.createdAt - left.createdAt),
)

const sortedContacts = computed<readonly AdminContactEnquiry[]>(() =>
  props.contacts.slice().sort((left, right) => right.createdAt - left.createdAt),
)

function folderLabel(folder: AdminEmailRecord['folder']): string {
  return folder === 'inbox' ? 'Inbox' : 'Sent'
}

function sourceLabel(source: AdminEmailRecord['source']): string {
  switch (source) {
    case 'inbound':
      return 'Contact inbound'
    case 'contact':
      return 'Contact reply'
    case 'bulk':
      return 'Bulk'
    case 'compose':
      return 'Compose'
    default:
      return assertNever(source)
  }
}

async function handleCompose(): Promise<void> {
  status.value = 'submitting'
  errorMessage.value = ''
  if (
    toAddress.value.trim().length === 0 ||
    subject.value.trim().length === 0 ||
    body.value.trim().length === 0
  ) {
    status.value = 'error'
    errorMessage.value = 'Please enter a recipient, subject, and message.'
    return
  }
  if (attachments.errorMessage.length > 0) {
    status.value = 'error'
    errorMessage.value = attachments.errorMessage
    return
  }
  try {
    await sendDirectEmail({
      to: toAddress.value.trim(),
      subject: subject.value.trim(),
      body: body.value.trim(),
      contactId: '',
      attachments: await attachments.toPayload(),
    })
    toAddress.value = ''
    subject.value = ''
    body.value = ''
    attachments.clear()
    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send email.'
  }
}

function startContactReply(contact: AdminContactEnquiry): void {
  replyByContactId.value = contact.id
  replySubject.value = contact.subject.length === 0 ? 'Re: your enquiry' : `Re: ${contact.subject}`
  replyBody.value = ''
  status.value = 'idle'
  errorMessage.value = ''
  attachments.clear()
}

function startInboxReply(email: AdminEmailRecord): void {
  replyEmailId.value = email.id
  toAddress.value = email.folder === 'inbox' ? email.fromAddress : email.to
  subject.value = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`
  body.value = ''
  status.value = 'idle'
  errorMessage.value = ''
  attachments.clear()
}

function cancelInboxReply(): void {
  replyEmailId.value = ''
  toAddress.value = ''
  subject.value = ''
  body.value = ''
  status.value = 'idle'
  errorMessage.value = ''
  attachments.clear()
}

function cancelContactReply(): void {
  replyByContactId.value = ''
  replySubject.value = ''
  replyBody.value = ''
  status.value = 'idle'
  errorMessage.value = ''
  attachments.clear()
}

function cancelCompose(): void {
  toAddress.value = ''
  subject.value = ''
  body.value = ''
  status.value = 'idle'
  errorMessage.value = ''
  attachments.clear()
  tab.value = 'inbox'
}

async function handleInboxReply(email: AdminEmailRecord): Promise<void> {
  status.value = 'submitting'
  errorMessage.value = ''
  if (
    toAddress.value.trim().length === 0 ||
    subject.value.trim().length === 0 ||
    body.value.trim().length === 0
  ) {
    status.value = 'error'
    errorMessage.value = 'Please enter a recipient, subject, and message.'
    return
  }
  if (attachments.errorMessage.length > 0) {
    status.value = 'error'
    errorMessage.value = attachments.errorMessage
    return
  }
  try {
    await sendDirectEmail({
      to: toAddress.value.trim(),
      subject: subject.value.trim(),
      body: body.value.trim(),
      contactId: email.contactId,
      attachments: await attachments.toPayload(),
    })
    replyEmailId.value = ''
    attachments.clear()
    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send this reply.'
  }
}

async function handleContactReply(contact: AdminContactEnquiry): Promise<void> {
  status.value = 'submitting'
  errorMessage.value = ''
  if (replySubject.value.trim().length === 0 || replyBody.value.trim().length === 0) {
    status.value = 'error'
    errorMessage.value = 'Please enter a subject and message.'
    return
  }
  if (attachments.errorMessage.length > 0) {
    status.value = 'error'
    errorMessage.value = attachments.errorMessage
    return
  }
  try {
    await sendDirectEmail({
      to: contact.email,
      subject: replySubject.value.trim(),
      body: replyBody.value.trim(),
      contactId: contact.id,
      attachments: await attachments.toPayload(),
    })
    replyByContactId.value = ''
    attachments.clear()
    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send this reply.'
  }
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-email-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="admin-email-heading" class="text-2xl font-bold text-text-default">Email</h2>
      <div class="flex flex-wrap gap-2">
        <AppButton
          type="button"
          size="sm"
          :variant="tab === 'inbox' ? 'primary' : 'secondary'"
          @click="tab = 'inbox'"
        >
          Inbox
        </AppButton>
        <AppButton
          type="button"
          size="sm"
          :variant="tab === 'compose' ? 'primary' : 'secondary'"
          @click="tab = 'compose'"
        >
          Compose
        </AppButton>
        <AppButton
          type="button"
          size="sm"
          :variant="tab === 'bulk' ? 'primary' : 'secondary'"
          @click="tab = 'bulk'"
        >
          Bulk
        </AppButton>
        <AppButton
          type="button"
          size="sm"
          :variant="tab === 'contact' ? 'primary' : 'secondary'"
          @click="tab = 'contact'"
        >
          Contact form inquiries
        </AppButton>
      </div>

      <div v-if="tab === 'inbox'" class="flex flex-col gap-3">
        <p v-if="sortedEmails.length === 0" class="text-sm text-text-muted">
          No email records yet. Contact form submissions and outbound sends appear here.
        </p>
        <ul
          v-else
          class="flex flex-col divide-y divide-border-default rounded-md border border-border-default"
        >
          <li v-for="email in sortedEmails" :key="email.id" class="flex flex-col gap-2 p-4">
            <p class="text-sm font-bold text-text-default">{{ email.subject }}</p>
            <p class="text-xs text-text-subtle">
              {{ folderLabel(email.folder) }} · {{ sourceLabel(email.source) }} ·
              {{ formatMillisAsDdMmYyyy(email.createdAt) }}
            </p>
            <p class="text-sm text-text-muted">To {{ email.to }} · From {{ email.fromAddress }}</p>
            <p class="text-sm text-text-default">{{ email.body }}</p>
            <p v-if="email.attachmentNames.length > 0" class="text-xs text-text-subtle">
              Attachments: {{ email.attachmentNames.join(', ') }}
            </p>
            <AppButton
              v-if="replyEmailId !== email.id"
              type="button"
              variant="secondary"
              size="xs"
              class="self-end"
              @click="startInboxReply(email)"
            >
              Reply
            </AppButton>
            <form
              v-else
              class="flex flex-col gap-3"
              novalidate
              @submit.prevent="handleInboxReply(email)"
            >
              <div class="flex flex-col gap-1.5">
                <label
                  :for="`inbox-reply-to-${email.id}`"
                  class="text-sm font-medium text-text-default"
                >
                  To <span class="font-normal text-text-subtle">(required)</span>
                </label>
                <input
                  :id="`inbox-reply-to-${email.id}`"
                  v-model="toAddress"
                  type="email"
                  required
                  aria-required="true"
                  class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  :for="`inbox-reply-subject-${email.id}`"
                  class="text-sm font-medium text-text-default"
                >
                  Subject <span class="font-normal text-text-subtle">(required)</span>
                </label>
                <input
                  :id="`inbox-reply-subject-${email.id}`"
                  v-model="subject"
                  type="text"
                  required
                  aria-required="true"
                  class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  :for="`inbox-reply-body-${email.id}`"
                  class="text-sm font-medium text-text-default"
                >
                  Message <span class="font-normal text-text-subtle">(required)</span>
                </label>
                <textarea
                  :id="`inbox-reply-body-${email.id}`"
                  v-model="body"
                  rows="4"
                  required
                  aria-required="true"
                  class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>
              <AdminEmailAttachments
                :field-id="`inbox-reply-files-${email.id}`"
                :files="attachments.files"
                :error-message="attachments.errorMessage"
                :accept="attachments.accept"
                :hint="attachments.hint"
                @add="attachments.addFiles"
                @remove="attachments.removeFile"
              />
              <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
                {{ errorMessage }}
              </p>
              <div class="flex flex-wrap gap-2">
                <AppButton type="submit" :disabled="status === 'submitting'">
                  {{ status === 'submitting' ? 'Sending...' : 'Send reply' }}
                </AppButton>
                <AppButton
                  type="button"
                  variant="secondary"
                  :disabled="status === 'submitting'"
                  @click="cancelInboxReply"
                >
                  Cancel
                </AppButton>
              </div>
            </form>
          </li>
        </ul>
      </div>

      <form
        v-else-if="tab === 'compose'"
        class="flex max-w-2xl flex-col gap-4"
        novalidate
        @submit.prevent="handleCompose"
      >
        <div class="flex flex-col gap-1.5">
          <label for="direct-email-to" class="text-sm font-medium text-text-default">To</label>
          <input
            id="direct-email-to"
            v-model="toAddress"
            type="email"
            required
            class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="direct-email-subject" class="text-sm font-medium text-text-default">
            Subject
          </label>
          <input
            id="direct-email-subject"
            v-model="subject"
            type="text"
            required
            class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="direct-email-body" class="text-sm font-medium text-text-default">
            Message
          </label>
          <textarea
            id="direct-email-body"
            v-model="body"
            rows="6"
            required
            class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          />
        </div>
        <AdminEmailAttachments
          field-id="direct-email-files"
          :files="attachments.files"
          :error-message="attachments.errorMessage"
          :accept="attachments.accept"
          :hint="attachments.hint"
          @add="attachments.addFiles"
          @remove="attachments.removeFile"
        />
        <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
          {{ errorMessage }}
        </p>
        <p v-if="status === 'success'" class="text-sm text-status-success" role="status">
          Email sent.
        </p>
        <div class="flex flex-wrap gap-2">
          <AppButton type="submit" :disabled="status === 'submitting'">
            {{ status === 'submitting' ? 'Sending...' : 'Send email' }}
          </AppButton>
          <AppButton
            type="button"
            variant="secondary"
            :disabled="status === 'submitting'"
            @click="cancelCompose"
          >
            Cancel
          </AppButton>
        </div>
      </form>

      <AdminBulkEmail v-else-if="tab === 'bulk'" :volunteers="volunteers" @cancel="tab = 'inbox'" />

      <div v-else class="flex flex-col gap-3">
        <p v-if="sortedContacts.length === 0" class="text-sm text-text-muted">
          No contact enquiries yet.
        </p>
        <ul
          v-else
          class="flex flex-col divide-y divide-border-default rounded-md border border-border-default"
        >
          <li v-for="contact in sortedContacts" :key="contact.id" class="flex flex-col gap-2 p-4">
            <p class="text-sm font-bold text-text-default">
              {{ contact.name }}
              <span class="font-medium text-text-subtle">({{ contact.email }})</span>
            </p>
            <p class="text-xs text-text-subtle">
              {{ contact.subject }} · {{ formatMillisAsDdMmYyyy(contact.createdAt) }}
              <template v-if="contact.repliedAt !== undefined"> · Replied</template>
            </p>
            <p class="text-sm text-text-muted">{{ contact.message }}</p>
            <AppButton
              v-if="replyByContactId !== contact.id"
              type="button"
              variant="secondary"
              size="xs"
              class="self-end"
              @click="startContactReply(contact)"
            >
              Reply
            </AppButton>
            <form
              v-else
              class="flex flex-col gap-3"
              novalidate
              @submit.prevent="handleContactReply(contact)"
            >
              <div class="flex flex-col gap-1.5">
                <label
                  :for="`contact-reply-subject-${contact.id}`"
                  class="text-sm font-medium text-text-default"
                >
                  Subject
                </label>
                <input
                  :id="`contact-reply-subject-${contact.id}`"
                  v-model="replySubject"
                  type="text"
                  required
                  class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  :for="`contact-reply-body-${contact.id}`"
                  class="text-sm font-medium text-text-default"
                >
                  Message
                </label>
                <textarea
                  :id="`contact-reply-body-${contact.id}`"
                  v-model="replyBody"
                  rows="4"
                  required
                  class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>
              <AdminEmailAttachments
                :field-id="`contact-reply-files-${contact.id}`"
                :files="attachments.files"
                :error-message="attachments.errorMessage"
                :accept="attachments.accept"
                :hint="attachments.hint"
                @add="attachments.addFiles"
                @remove="attachments.removeFile"
              />
              <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
                {{ errorMessage }}
              </p>
              <div class="flex flex-wrap gap-2">
                <AppButton type="submit" :disabled="status === 'submitting'">
                  {{ status === 'submitting' ? 'Sending...' : 'Send reply' }}
                </AppButton>
                <AppButton
                  type="button"
                  variant="secondary"
                  :disabled="status === 'submitting'"
                  @click="cancelContactReply"
                >
                  Cancel
                </AppButton>
              </div>
            </form>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
