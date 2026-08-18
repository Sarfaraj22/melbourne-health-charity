<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDateTimePicker from '@/components/ui/AppDateTimePicker.vue'
import type { AdminEventStatus, AdminFormStatus } from '@/types/admin'
import type { EventFormErrors, EventFormState } from '@/types/admin'

interface Props {
  readonly form: EventFormState
  readonly errors: EventFormErrors
  readonly status: AdminFormStatus
  readonly errorMessage: string
  readonly statusOptions: readonly AdminEventStatus[]
  readonly submitLabel: string
}

const props = defineProps<Props>()

interface Emits {
  (event: 'update-title', value: string): void
  (event: 'update-slug', value: string): void
  (event: 'update-summary', value: string): void
  (event: 'update-description', value: string): void
  (event: 'update-date', value: string): void
  (event: 'update-time', value: string): void
  (event: 'update-location', value: string): void
  (event: 'update-status', value: AdminEventStatus): void
  (event: 'submit'): void
}

const emit = defineEmits<Emits>()

const isSubmitting = computed<boolean>(() => props.status === 'submitting')
const isSuccess = computed<boolean>(() => props.status === 'success')
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="emit('submit')">
    <div class="flex flex-col gap-1.5">
      <label for="event-title" class="text-sm font-medium text-text-default">Title</label>
      <input
        id="event-title"
        type="text"
        required
        :value="form.title"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-title', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.title" class="text-sm text-brand-donate">{{ errors.title }}</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="event-slug" class="text-sm font-medium text-text-default">Slug</label>
      <input
        id="event-slug"
        type="text"
        :value="form.slug"
        :disabled="isSubmitting"
        placeholder="auto-generated from title if left blank"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-slug', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.slug" class="text-sm text-brand-donate">{{ errors.slug }}</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="event-summary" class="text-sm font-medium text-text-default">Summary</label>
      <input
        id="event-summary"
        type="text"
        :value="form.summary"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-summary', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="event-description" class="text-sm font-medium text-text-default"
        >Description</label
      >
      <textarea
        id="event-description"
        :value="form.description"
        :disabled="isSubmitting"
        rows="4"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-description', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <p id="event-date-label" class="text-sm font-medium text-text-default">Date and time</p>
      <AppDateTimePicker
        :date="form.date"
        :time="form.time"
        date-input-id="event-date"
        time-input-id="event-time"
        :allow-past="true"
        time-mode="text"
        :date-invalid="errors.date !== undefined"
        :time-invalid="false"
        date-described-by=""
        time-described-by=""
        :disabled="isSubmitting"
        @update:date="emit('update-date', $event)"
        @update:time="emit('update-time', $event)"
      />
      <p v-if="errors.date" class="text-sm text-brand-donate">{{ errors.date }}</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="event-location" class="text-sm font-medium text-text-default">Location</label>
      <input
        id="event-location"
        type="text"
        :value="form.location"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-location', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="event-status" class="text-sm font-medium text-text-default">Status</label>
      <select
        id="event-status"
        :value="form.status"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @change="
          emit('update-status', ($event.target as HTMLSelectElement).value as AdminEventStatus)
        "
      >
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ option === 'published' ? 'Published' : 'Draft' }}
        </option>
      </select>
    </div>

    <p v-if="status === 'error'" class="text-sm text-brand-donate">{{ errorMessage }}</p>
    <p v-if="isSuccess" class="text-sm text-status-success">Event saved successfully.</p>

    <AppButton type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : submitLabel }}
    </AppButton>
  </form>
</template>
