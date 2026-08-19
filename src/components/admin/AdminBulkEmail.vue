<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { sendBulkEmail } from '@/services/firebase/functions.service'
import type { AdminVolunteer } from '@/types/admin'
import type { BulkEmailAudience } from '@/types/functions'

interface Props {
  readonly volunteers: readonly AdminVolunteer[]
}

const props = defineProps<Props>()

const subject = ref<string>('')
const body = ref<string>('')
const audience = ref<BulkEmailAudience>('volunteers')
const sendSelectedVolunteers = ref<boolean>(false)
const selectedIds = ref<ReadonlySet<string>>(new Set())
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref<string>('')
const sentCount = ref<number>(0)

const selectedCount = computed<number>(() => {
  if (sendSelectedVolunteers.value) {
    return selectedIds.value.size
  }
  return props.volunteers.length
})

function toggleVolunteer(id: string): void {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

function handleToggle(event: Event, id: string): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    toggleVolunteer(id)
  }
}

async function handleSubmit(): Promise<void> {
  status.value = 'submitting'
  errorMessage.value = ''
  if (subject.value.trim().length === 0 || body.value.trim().length === 0) {
    status.value = 'error'
    errorMessage.value = 'Please enter a subject and message.'
    return
  }
  if (sendSelectedVolunteers.value && selectedIds.value.size === 0) {
    status.value = 'error'
    errorMessage.value = 'Select at least one volunteer, or send to an audience.'
    return
  }
  try {
    const result = await sendBulkEmail({
      subject: subject.value.trim(),
      body: body.value.trim(),
      audience: audience.value,
      volunteerIds: sendSelectedVolunteers.value ? [...selectedIds.value] : [],
    })
    sentCount.value = result.sent
    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send email.'
  }
}
</script>

<template>
  <form class="flex max-w-2xl flex-col gap-4" novalidate @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-1.5">
      <label for="bulk-email-audience" class="text-sm font-medium text-text-default">
        Audience
      </label>
      <select
        id="bulk-email-audience"
        v-model="audience"
        :disabled="sendSelectedVolunteers"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <option value="all">All users and volunteers</option>
        <option value="users">Registered users</option>
        <option value="volunteers">Volunteers</option>
      </select>
    </div>
    <label class="flex items-center gap-2 text-sm text-text-default">
      <input v-model="sendSelectedVolunteers" type="checkbox" class="accent-brand-primary" />
      Send to a volunteer subset instead ({{ volunteers.length }} in directory)
    </label>
    <fieldset v-if="sendSelectedVolunteers" class="flex flex-col gap-2">
      <legend class="text-sm font-medium text-text-default">Select volunteers</legend>
      <label
        v-for="volunteer in volunteers"
        :key="volunteer.id"
        class="flex items-center gap-2 text-sm text-text-default"
      >
        <input
          type="checkbox"
          class="accent-brand-primary"
          :checked="selectedIds.has(volunteer.id)"
          @change="handleToggle($event, volunteer.id)"
        />
        {{ volunteer.name }} ({{ volunteer.email }})
      </label>
    </fieldset>
    <div class="flex flex-col gap-1.5">
      <label for="bulk-email-subject" class="text-sm font-medium text-text-default">Subject</label>
      <input
        id="bulk-email-subject"
        v-model="subject"
        type="text"
        required
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      />
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="bulk-email-body" class="text-sm font-medium text-text-default">Message</label>
      <textarea
        id="bulk-email-body"
        v-model="body"
        rows="5"
        required
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      />
    </div>
    <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="status === 'success'" class="text-sm text-status-success" role="status">
      Sent to {{ sentCount }} recipient{{ sentCount === 1 ? '' : 's' }}.
    </p>
    <AppButton type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Sending...' : `Send email (${selectedCount})` }}
    </AppButton>
  </form>
</template>
