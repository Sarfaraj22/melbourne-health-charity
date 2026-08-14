<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useVolunteerApplicationForm } from '@/composables/useVolunteerApplicationForm'
import type { VolunteerAvailability, VolunteerOpportunityCategory } from '@/types/volunteer'
import lockIcon from '@/assets/icons/lock.svg?raw'

const {
  form,
  errors,
  status,
  availableInterests,
  availabilityOptions,
  setName,
  setEmail,
  setPhone,
  toggleInterest,
  setAvailability,
  setMessage,
  submit,
  reset,
} = useVolunteerApplicationForm()

const availabilityLabels: Record<VolunteerAvailability, string> = {
  weekday: 'Weekdays',
  weekend: 'Weekends',
  evening: 'Evenings',
  flexible: 'Flexible',
}

const nameErrorId = 'volunteer-name-error'
const emailErrorId = 'volunteer-email-error'
const phoneErrorId = 'volunteer-phone-error'
const interestsErrorId = 'volunteer-interests-error'
const availabilityErrorId = 'volunteer-availability-error'
const successMessageId = 'volunteer-success-message'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const phoneDescribedBy = computed((): string | undefined =>
  errors.value.phone ? phoneErrorId : undefined,
)
const interestsDescribedBy = computed((): string | undefined =>
  errors.value.interests ? interestsErrorId : undefined,
)
const availabilityDescribedBy = computed((): string | undefined =>
  errors.value.availability ? availabilityErrorId : undefined,
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

function handleInterestToggle(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    const value = target.value as VolunteerOpportunityCategory
    toggleInterest(value)
  }
}

function handleAvailabilityChange(event: Event): void {
  const target = event.target
  if (target instanceof HTMLSelectElement) {
    const value = target.value
    if (value === 'weekday' || value === 'weekend' || value === 'evening' || value === 'flexible') {
      setAvailability(value)
    } else if (value === '') {
      setAvailability('')
    }
  }
}

function handleMessageInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLTextAreaElement) {
    setMessage(target.value)
  }
}
</script>

<template>
  <section aria-labelledby="volunteer-application-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex max-w-xl flex-col gap-2">
        <h2
          id="volunteer-application-heading"
          class="text-2xl font-bold text-text-default sm:text-3xl"
        >
          Apply to volunteer
        </h2>
        <p class="text-base text-text-muted">
          Complete this short form and a coordinator will be in touch for a friendly chat.
        </p>
      </div>

      <p
        v-if="status === 'success'"
        :id="successMessageId"
        role="status"
        class="max-w-xl rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
      >
        Thank you for your interest in volunteering. Your application has been received and a
        coordinator will contact you soon.
        <button type="button" class="font-bold text-brand-primary underline" @click="reset">
          Submit another application
        </button>
      </p>

      <form v-else class="flex max-w-xl flex-col gap-4" novalidate @submit="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <label for="volunteer-name" class="text-xs font-medium text-text-subtle">Name</label>
          <input
            id="volunteer-name"
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
          <label for="volunteer-email" class="text-xs font-medium text-text-subtle">Email</label>
          <input
            id="volunteer-email"
            type="email"
            autocomplete="email"
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
          <label for="volunteer-phone" class="text-xs font-medium text-text-subtle">Phone</label>
          <input
            id="volunteer-phone"
            type="tel"
            autocomplete="tel"
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

        <fieldset class="flex flex-col gap-2" :aria-describedby="interestsDescribedBy">
          <legend class="text-xs font-medium text-text-subtle">Areas of interest</legend>
          <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <li v-for="interest in availableInterests" :key="interest.id">
              <label
                class="flex cursor-pointer items-center gap-2 rounded border border-border-default px-3 py-2 text-sm text-text-default focus-within:ring-2 focus-within:ring-brand-primary"
              >
                <input
                  type="checkbox"
                  :value="interest.id"
                  :checked="form.interests.has(interest.id)"
                  class="accent-brand-primary"
                  @change="handleInterestToggle"
                />
                {{ interest.label }}
              </label>
            </li>
          </ul>
          <p
            v-if="errors.interests"
            :id="interestsErrorId"
            class="text-xs text-brand-accent"
            role="alert"
          >
            {{ errors.interests }}
          </p>
        </fieldset>

        <div class="flex flex-col gap-1.5">
          <label for="volunteer-availability" class="text-xs font-medium text-text-subtle">
            Availability
          </label>
          <select
            id="volunteer-availability"
            :value="form.availability"
            :aria-invalid="errors.availability ? true : undefined"
            :aria-describedby="availabilityDescribedBy"
            class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @change="handleAvailabilityChange"
          >
            <option value="" disabled>Select your availability</option>
            <option v-for="option in availabilityOptions" :key="option" :value="option">
              {{ availabilityLabels[option] }}
            </option>
          </select>
          <p
            v-if="errors.availability"
            :id="availabilityErrorId"
            class="text-xs text-brand-accent"
            role="alert"
          >
            {{ errors.availability }}
          </p>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="volunteer-message" class="text-xs font-medium text-text-subtle">
            Anything else we should know? (optional)
          </label>
          <textarea
            id="volunteer-message"
            :value="form.message"
            rows="3"
            placeholder="e.g. Skills, experience, or support you may need"
            class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @input="handleMessageInput"
          />
        </div>

        <div class="flex items-center justify-center gap-1.5">
          <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:size-3" />
          <p class="text-xs text-text-subtle">
            Your information is encrypted and kept confidential
          </p>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="status === 'submitting'"
        >
          Submit application
        </AppButton>
      </form>
    </div>
  </section>
</template>
