<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import FormFieldLabel from '@/components/ui/FormFieldLabel.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useLoginForm } from '@/composables/useLoginForm'
import type { Role } from '@/types/auth'

interface Props {
  readonly expectedRole?: Role
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { form, errors, status, errorMessage, setEmail, setPassword, submit } = useLoginForm(
  props.expectedRole,
)

const emailErrorId = 'login-email-error'
const passwordErrorId = 'login-password-error'
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)

const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const passwordDescribedBy = computed((): string | undefined =>
  errors.value.password ? passwordErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  const result = await submit()
  if (result.success) {
    emit('success')
    return
  }
  await nextTick()
  if (errors.value.email !== undefined) {
    emailInput.value?.focus()
    return
  }
  if (errors.value.password !== undefined) {
    passwordInput.value?.focus()
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
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit="handleSubmit">
    <div class="flex flex-col gap-1.5">
      <FormFieldLabel html-for="login-email" :required="true">Email</FormFieldLabel>
      <input
        id="login-email"
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
      <FormFieldLabel html-for="login-password" :required="true">Password</FormFieldLabel>
      <input
        id="login-password"
        ref="passwordInput"
        type="password"
        autocomplete="current-password"
        required
        aria-required="true"
        :value="form.password"
        :aria-invalid="errors.password ? true : undefined"
        :aria-describedby="passwordDescribedBy"
        class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        @input="handlePasswordInput"
      />
      <p
        v-if="errors.password"
        :id="passwordErrorId"
        class="text-xs text-brand-accent"
        role="alert"
      >
        {{ errors.password }}
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
      {{ status === 'submitting' ? 'Signing in…' : 'Sign in' }}
    </AppButton>
  </form>
</template>
