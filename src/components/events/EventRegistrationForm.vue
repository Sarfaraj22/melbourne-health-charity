<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useEventRegistrationForm } from '@/composables/useEventRegistrationForm'
import lockIcon from '@/assets/icons/lock.svg?raw'

interface Props {
  readonly eventTitle: string
  readonly eventSlug: string
}

const props = defineProps<Props>()

const {
  form,
  errors,
  isSubmitted,
  isSubmitting,
  isError,
  errorMessage,
  setName,
  setEmail,
  setPhone,
  setAttendees,
  setAccessibilityRequirements,
  setOptInUpdates,
  submit,
} = useEventRegistrationForm(props.eventSlug)

const nameErrorId = 'event-reg-name-error'
const emailErrorId = 'event-reg-email-error'
const phoneErrorId = 'event-reg-phone-error'
const attendeesErrorId = 'event-reg-attendees-error'
const successMessageId = 'event-reg-success-message'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const phoneDescribedBy = computed((): string | undefined =>
  errors.value.phone ? phoneErrorId : undefined,
)
const attendeesDescribedBy = computed((): string | undefined =>
  errors.value.attendees ? attendeesErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  await submit()
}

function handleNameInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setName(target.value)
  }
}

function handleEmailInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setEmail(target.value)
  }
}

function handlePhoneInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setPhone(target.value)
  }
}

function handleAttendeesInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setAttendees(target.value)
  }
}

function handleAccessibilityInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLTextAreaElement) {
    setAccessibilityRequirements(target.value)
  }
}

function handleOptInChange(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setOptInUpdates(target.checked)
  }
}
</script>

<template>
  <aside
    aria-labelledby="event-reg-heading"
    class="rounded-lg border border-border-default bg-surface p-6"
  >
    <h2 id="event-reg-heading" class="text-lg font-bold text-text-default">
      Register for this event
    </h2>

    <p
      v-if="isSubmitted"
      :id="successMessageId"
      role="status"
      class="mt-4 rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
    >
      Thank you. Your registration for {{ eventTitle }} has been received. Our team will email you a
      confirmation with all the details.
    </p>

    <form v-else class="mt-4 flex flex-col gap-4" novalidate @submit="handleSubmit">
      <p v-if="isError" class="text-xs text-brand-accent" role="alert">
        {{ errorMessage }}
      </p>
      <div class="flex flex-col gap-1.5">
        <label for="event-reg-name" class="text-xs font-medium text-text-subtle">
          Name (required)
        </label>
        <input
          id="event-reg-name"
          type="text"
          autocomplete="name"
          required
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
        <label for="event-reg-email" class="text-xs font-medium text-text-subtle">
          Email (required)
        </label>
        <input
          id="event-reg-email"
          type="email"
          autocomplete="email"
          required
          :value="form.email"
          :aria-invalid="errors.email ? true : undefined"
          :aria-describedby="emailDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleEmailInput"
        />
        <p v-if="errors.email" :id="emailErrorId" class="text-xs text-brand-accent" role="alert">
          {{ errors.email }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="event-reg-phone" class="text-xs font-medium text-text-subtle">
          Phone (required)
        </label>
        <input
          id="event-reg-phone"
          type="tel"
          autocomplete="tel"
          required
          :value="form.phone"
          :aria-invalid="errors.phone ? true : undefined"
          :aria-describedby="phoneDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handlePhoneInput"
        />
        <p v-if="errors.phone" :id="phoneErrorId" class="text-xs text-brand-accent" role="alert">
          {{ errors.phone }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="event-reg-attendees" class="text-xs font-medium text-text-subtle">
          Number of attendees (required)
        </label>
        <input
          id="event-reg-attendees"
          type="number"
          min="1"
          max="20"
          inputmode="numeric"
          required
          :value="form.attendees"
          :aria-invalid="errors.attendees ? true : undefined"
          :aria-describedby="attendeesDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleAttendeesInput"
        />
        <p
          v-if="errors.attendees"
          :id="attendeesErrorId"
          class="text-xs text-brand-accent"
          role="alert"
        >
          {{ errors.attendees }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="event-reg-accessibility" class="text-xs font-medium text-text-subtle">
          Accessibility requirements (optional)
        </label>
        <textarea
          id="event-reg-accessibility"
          :value="form.accessibilityRequirements"
          rows="3"
          placeholder="e.g. Wheelchair access, Auslan interpreter, quiet space"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleAccessibilityInput"
        />
      </div>

      <label class="flex items-start gap-2.5 text-sm text-text-default">
        <input
          type="checkbox"
          :checked="form.optInUpdates"
          class="mt-0.5 size-4 rounded border-border-default text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @change="handleOptInChange"
        />
        <span>Send me updates about future events and charity news.</span>
      </label>

      <div class="flex items-center justify-center gap-1.5">
        <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
        <span aria-hidden="true" class="size-3 text-text-subtle [&>svg]:size-3" v-html="lockIcon" />
        <p class="text-xs text-text-subtle">Your information is encrypted and kept confidential</p>
      </div>

      <AppButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
        Submit registration
      </AppButton>
    </form>
  </aside>
</template>
