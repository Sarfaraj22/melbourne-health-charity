<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import lockIcon from '@/assets/icons/lock.svg?raw'
import { useLoginForm } from '@/composables/useLoginForm'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { form, errors, status, errorMessage, setEmail, setPassword, submit } = useLoginForm()

const emailErrorId = 'login-email-error'
const passwordErrorId = 'login-password-error'

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
      <label for="login-email" class="text-xs font-medium text-text-subtle">Email</label>
      <input
        id="login-email"
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
      <label for="login-password" class="text-xs font-medium text-text-subtle">Password</label>
      <input
        id="login-password"
        type="password"
        autocomplete="current-password"
        required
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
