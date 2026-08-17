<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useContactForm } from '@/composables/useContactForm'
import lockIcon from '@/assets/icons/lock.svg?raw'
import sendIcon from '@/assets/icons/send.svg?raw'

const {
  form,
  errors,
  status,
  errorMessage,
  setName,
  setEmail,
  setPhone,
  setSubject,
  setMessage,
  submit,
  reset,
} = useContactForm()

const nameErrorId = 'contact-name-error'
const emailErrorId = 'contact-email-error'
const phoneErrorId = 'contact-phone-error'
const subjectErrorId = 'contact-subject-error'
const messageErrorId = 'contact-message-error'
const successMessageId = 'contact-success-message'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const phoneDescribedBy = computed((): string | undefined =>
  errors.value.phone ? phoneErrorId : undefined,
)
const subjectDescribedBy = computed((): string | undefined =>
  errors.value.subject ? subjectErrorId : undefined,
)
const messageDescribedBy = computed((): string | undefined =>
  errors.value.message ? messageErrorId : undefined,
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

function handleSubjectInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setSubject(target.value)
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
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 id="contact-form-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Send us a message
      </h2>
      <p class="text-base text-text-muted">
        Complete this form and a team member will get back to you within two business days.
      </p>
    </div>

    <p
      v-if="status === 'success'"
      :id="successMessageId"
      role="status"
      class="rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
    >
      Thank you for contacting us. Your message has been received and we will reply soon.
      <button type="button" class="font-bold text-brand-primary underline" @click="reset">
        Submit another message
      </button>
    </p>

    <form v-else class="flex flex-col gap-4" novalidate @submit="handleSubmit">
      <p v-if="status === 'error'" class="text-xs text-brand-accent" role="alert">
        {{ errorMessage }}
      </p>
      <div class="flex flex-col gap-1.5">
        <label for="contact-name" class="text-xs font-medium text-text-subtle">Name</label>
        <input
          id="contact-name"
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
        <label for="contact-email" class="text-xs font-medium text-text-subtle">Email</label>
        <input
          id="contact-email"
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
        <label for="contact-phone" class="text-xs font-medium text-text-subtle">
          Phone (optional)
        </label>
        <input
          id="contact-phone"
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

      <div class="flex flex-col gap-1.5">
        <label for="contact-subject" class="text-xs font-medium text-text-subtle">Subject</label>
        <input
          id="contact-subject"
          type="text"
          :value="form.subject"
          :aria-invalid="errors.subject ? true : undefined"
          :aria-describedby="subjectDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleSubjectInput"
        />
        <p
          v-if="errors.subject"
          :id="subjectErrorId"
          class="text-xs text-brand-accent"
          role="alert"
        >
          {{ errors.subject }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="contact-message" class="text-xs font-medium text-text-subtle">Message</label>
        <textarea
          id="contact-message"
          :value="form.message"
          rows="5"
          :aria-invalid="errors.message ? true : undefined"
          :aria-describedby="messageDescribedBy"
          class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleMessageInput"
        />
        <p
          v-if="errors.message"
          :id="messageErrorId"
          class="text-xs text-brand-accent"
          role="alert"
        >
          {{ errors.message }}
        </p>
      </div>

      <div class="flex items-center justify-center gap-1.5">
        <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:size-3" />
        <p class="text-xs text-text-subtle">Your information is encrypted and kept confidential</p>
      </div>

      <AppButton
        type="submit"
        variant="primary"
        class="w-full gap-2"
        :disabled="status === 'submitting'"
      >
        <AppIcon :svg="sendIcon" class-name="[&>svg]:h-4 [&>svg]:w-4" />
        Send message
      </AppButton>
    </form>
  </div>
</template>
