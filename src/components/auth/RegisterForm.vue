<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import FormFieldLabel from '@/components/ui/FormFieldLabel.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useRegisterForm } from '@/composables/useRegisterForm'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const {
  form,
  errors,
  status,
  errorMessage,
  setName,
  setEmail,
  setPassword,
  setConfirmPassword,
  submit,
} = useRegisterForm()

const nameErrorId = 'register-name-error'
const emailErrorId = 'register-email-error'
const passwordErrorId = 'register-password-error'
const confirmPasswordErrorId = 'register-confirm-password-error'

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)
const confirmPasswordInput = ref<HTMLInputElement | null>(null)

const passwordHintId = 'register-password-hint'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const passwordDescribedBy = computed((): string =>
  errors.value.password ? `${passwordHintId} ${passwordErrorId}` : passwordHintId,
)
const confirmPasswordDescribedBy = computed((): string | undefined =>
  errors.value.confirmPassword ? confirmPasswordErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  const result = await submit()
  if (result.success) {
    emit('success')
    return
  }
  await nextTick()
  if (errors.value.name !== undefined) {
    nameInput.value?.focus()
    return
  }
  if (errors.value.email !== undefined) {
    emailInput.value?.focus()
    return
  }
  if (errors.value.password !== undefined) {
    passwordInput.value?.focus()
    return
  }
  confirmPasswordInput.value?.focus()
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

function handlePasswordInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setPassword(target.value)
  }
}

function handleConfirmPasswordInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setConfirmPassword(target.value)
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit="handleSubmit">
    <div class="flex flex-col gap-1.5">
      <FormFieldLabel html-for="register-name" :required="true">Full name</FormFieldLabel>
      <input
        id="register-name"
        ref="nameInput"
        type="text"
        autocomplete="name"
        required
        aria-required="true"
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
      <FormFieldLabel html-for="register-email" :required="true">Email</FormFieldLabel>
      <input
        id="register-email"
        ref="emailInput"
        type="email"
        autocomplete="email"
        required
        aria-required="true"
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
      <FormFieldLabel html-for="register-password" :required="true">Password</FormFieldLabel>
      <input
        id="register-password"
        ref="passwordInput"
        type="password"
        autocomplete="new-password"
        required
        aria-required="true"
        :value="form.password"
        :aria-invalid="errors.password ? true : undefined"
        :aria-describedby="passwordDescribedBy"
        class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        @input="handlePasswordInput"
      />
      <p id="register-password-hint" class="text-xs text-text-subtle">
        Must be at least 8 characters.
      </p>
      <p
        v-if="errors.password"
        :id="passwordErrorId"
        class="text-xs text-brand-accent"
        role="alert"
      >
        {{ errors.password }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <FormFieldLabel html-for="register-confirm-password" :required="true">
        Confirm password
      </FormFieldLabel>
      <input
        id="register-confirm-password"
        ref="confirmPasswordInput"
        type="password"
        autocomplete="new-password"
        required
        aria-required="true"
        :value="form.confirmPassword"
        :aria-invalid="errors.confirmPassword ? true : undefined"
        :aria-describedby="confirmPasswordDescribedBy"
        class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        @input="handleConfirmPasswordInput"
      />
      <p
        v-if="errors.confirmPassword"
        :id="confirmPasswordErrorId"
        class="text-xs text-brand-accent"
        role="alert"
      >
        {{ errors.confirmPassword }}
      </p>
    </div>

    <p v-if="status === 'error'" class="text-xs text-brand-accent" role="alert">
      {{ errorMessage }}
    </p>

    <div class="flex items-center justify-center gap-1.5">
      <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:size-3" />
      <p class="text-xs text-text-subtle">Your information is encrypted and kept confidential</p>
    </div>

    <AppButton type="submit" variant="primary" class="w-full" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Creating account…' : 'Create account' }}
    </AppButton>
  </form>
</template>
