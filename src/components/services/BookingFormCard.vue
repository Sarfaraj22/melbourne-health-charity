<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useBookingForm } from '@/composables/useBookingForm'
import type { SupportType, TransportRequired } from '@/types/service'
import lockIcon from '@/assets/icons/lock.svg?raw'

interface Props {
  readonly serviceTitle: string
}

defineProps<Props>()

const {
  form,
  errors,
  isSubmitted,
  isSubmitting,
  setName,
  setDate,
  setTime,
  setSupportType,
  setAccessibilityRequirements,
  setTransportRequired,
  submit,
} = useBookingForm()

const supportTypeOptions: readonly { readonly value: SupportType; readonly label: string }[] = [
  { value: 'in-person', label: 'In-person' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'phone', label: 'Phone' },
]

const transportOptions: readonly { readonly value: TransportRequired; readonly label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const nameErrorId = 'booking-name-error'
const dateErrorId = 'booking-date-error'
const timeErrorId = 'booking-time-error'
const supportTypeErrorId = 'booking-support-type-error'
const successMessageId = 'booking-success-message'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const dateDescribedBy = computed((): string | undefined =>
  errors.value.date ? dateErrorId : undefined,
)
const timeDescribedBy = computed((): string | undefined =>
  errors.value.time ? timeErrorId : undefined,
)
const supportTypeDescribedBy = computed((): string | undefined =>
  errors.value.supportType ? supportTypeErrorId : undefined,
)

function handleSubmit(event: Event): void {
  event.preventDefault()
  submit()
}

function handleNameInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setName(target.value)
  }
}

function handleDateInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setDate(target.value)
  }
}

function handleTimeInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setTime(target.value)
  }
}

function handleSupportTypeChange(event: Event): void {
  const target = event.target
  if (target instanceof HTMLSelectElement) {
    const value = target.value
    if (value === 'in-person' || value === 'telehealth' || value === 'phone') {
      setSupportType(value)
    }
  }
}

function handleAccessibilityInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLTextAreaElement) {
    setAccessibilityRequirements(target.value)
  }
}
</script>

<template>
  <aside
    aria-labelledby="booking-heading"
    class="rounded border border-border-default bg-surface p-6"
  >
    <h2 id="booking-heading" class="text-lg font-bold text-text-default">Book Appointment</h2>

    <p
      v-if="isSubmitted"
      :id="successMessageId"
      role="status"
      class="mt-4 rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
    >
      Thank you. Your booking request for {{ serviceTitle }} has been received. Our team will
      contact you to confirm your appointment.
    </p>

    <form v-else class="mt-4 flex flex-col gap-4" novalidate @submit="handleSubmit">
      <div class="flex flex-col gap-1.5">
        <label for="booking-name" class="text-xs font-medium text-text-subtle">Name</label>
        <input
          id="booking-name"
          type="text"
          autocomplete="name"
          :value="form.name"
          :aria-invalid="errors.name ? true : undefined"
          :aria-describedby="nameDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleNameInput"
        />
        <p v-if="errors.name" :id="nameErrorId" class="text-xs text-brand-accent" role="alert">
          {{ errors.name }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="booking-date" class="text-xs font-medium text-text-subtle">Date</label>
        <input
          id="booking-date"
          type="date"
          :value="form.date"
          :aria-invalid="errors.date ? true : undefined"
          :aria-describedby="dateDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleDateInput"
        />
        <p v-if="errors.date" :id="dateErrorId" class="text-xs text-brand-accent" role="alert">
          {{ errors.date }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="booking-time" class="text-xs font-medium text-text-subtle">Time</label>
        <input
          id="booking-time"
          type="time"
          :value="form.time"
          :aria-invalid="errors.time ? true : undefined"
          :aria-describedby="timeDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleTimeInput"
        />
        <p v-if="errors.time" :id="timeErrorId" class="text-xs text-brand-accent" role="alert">
          {{ errors.time }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="booking-support-type" class="text-xs font-medium text-text-subtle">
          Support Type
        </label>
        <select
          id="booking-support-type"
          :value="form.supportType"
          :aria-invalid="errors.supportType ? true : undefined"
          :aria-describedby="supportTypeDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @change="handleSupportTypeChange"
        >
          <option value="" disabled>Select a support type</option>
          <option v-for="option in supportTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p
          v-if="errors.supportType"
          :id="supportTypeErrorId"
          class="text-xs text-brand-accent"
          role="alert"
        >
          {{ errors.supportType }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="booking-accessibility" class="text-xs font-medium text-text-subtle">
          Accessibility Requirements
        </label>
        <textarea
          id="booking-accessibility"
          :value="form.accessibilityRequirements"
          rows="3"
          placeholder="e.g. Wheelchair access, Auslan interpreter"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleAccessibilityInput"
        />
      </div>

      <fieldset class="flex flex-col gap-1.5">
        <legend class="text-xs font-medium text-text-subtle">Transport Required</legend>
        <div class="flex gap-2" role="radiogroup" aria-label="Transport Required">
          <button
            v-for="option in transportOptions"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="form.transportRequired === option.value"
            :class="[
              'rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
              form.transportRequired === option.value
                ? 'bg-text-default text-text-on-brand'
                : 'border border-border-default bg-surface text-text-default',
            ]"
            @click="setTransportRequired(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <div class="flex items-center justify-center gap-1.5">
        <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
        <span aria-hidden="true" class="size-3 text-text-subtle [&>svg]:size-3" v-html="lockIcon" />
        <p class="text-xs text-text-subtle">Your information is encrypted and kept confidential</p>
      </div>

      <AppButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
        Submit Booking
      </AppButton>
    </form>
  </aside>
</template>
