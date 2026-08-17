<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { AdminFormStatus, AdminVolunteerStatus } from '@/types/admin'
import type { VolunteerFormErrors, VolunteerFormState } from '@/types/admin'

interface Props {
  readonly form: VolunteerFormState
  readonly errors: VolunteerFormErrors
  readonly status: AdminFormStatus
  readonly errorMessage: string
  readonly statusOptions: readonly AdminVolunteerStatus[]
  readonly submitLabel: string
}

const props = defineProps<Props>()

interface Emits {
  (event: 'update-name', value: string): void
  (event: 'update-email', value: string): void
  (event: 'update-phone', value: string): void
  (event: 'update-status', value: AdminVolunteerStatus): void
  (event: 'update-training-percent', value: string): void
  (event: 'update-hours', value: string): void
  (event: 'submit'): void
}

const emit = defineEmits<Emits>()

const isSubmitting = computed<boolean>(() => props.status === 'submitting')
const isSuccess = computed<boolean>(() => props.status === 'success')
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="emit('submit')">
    <div class="flex flex-col gap-1.5">
      <label for="volunteer-name" class="text-sm font-medium text-text-default">Name</label>
      <input
        id="volunteer-name"
        type="text"
        :value="form.name"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-name', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.name" class="text-sm text-brand-donate">{{ errors.name }}</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="volunteer-email" class="text-sm font-medium text-text-default">Email</label>
      <input
        id="volunteer-email"
        type="email"
        :value="form.email"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-email', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.email" class="text-sm text-brand-donate">{{ errors.email }}</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="volunteer-phone" class="text-sm font-medium text-text-default">Phone</label>
      <input
        id="volunteer-phone"
        type="tel"
        :value="form.phone"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-phone', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="volunteer-status" class="text-sm font-medium text-text-default">Status</label>
      <select
        id="volunteer-status"
        :value="form.status"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @change="
          emit('update-status', ($event.target as HTMLSelectElement).value as AdminVolunteerStatus)
        "
      >
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ option === 'active' ? 'Active' : 'Pending' }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="volunteer-training" class="text-sm font-medium text-text-default"
        >Training (%)</label
      >
      <input
        id="volunteer-training"
        type="number"
        min="0"
        max="100"
        :value="form.trainingPercent"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-training-percent', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.trainingPercent" class="text-sm text-brand-donate">
        {{ errors.trainingPercent }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="volunteer-hours" class="text-sm font-medium text-text-default">Hours</label>
      <input
        id="volunteer-hours"
        type="number"
        min="0"
        :value="form.hours"
        :disabled="isSubmitting"
        class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="emit('update-hours', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.hours" class="text-sm text-brand-donate">{{ errors.hours }}</p>
    </div>

    <p v-if="status === 'error'" class="text-sm text-brand-donate">{{ errorMessage }}</p>
    <p v-if="isSuccess" class="text-sm text-status-success">Volunteer saved successfully.</p>

    <AppButton type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : submitLabel }}
    </AppButton>
  </form>
</template>
