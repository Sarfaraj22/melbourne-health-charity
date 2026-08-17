<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import mailIcon from '@/assets/icons/mail.svg?raw'
import { useForgotPasswordForm } from '@/composables/useForgotPasswordForm'

const { form, errors, status, errorMessage, setEmail, submit } = useForgotPasswordForm()

const emailErrorId = 'forgot-email-error'
const successMessageId = 'forgot-success-message'

const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  await submit()
}

function handleEmailInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setEmail(target.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p
      v-if="status === 'success'"
      :id="successMessageId"
      role="status"
      class="flex items-center gap-2 rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
    >
      <AppIcon :svg="mailIcon" class-name="shrink-0 text-brand-accent [&>svg]:h-5 [&>svg]:w-5" />
      If an account exists for that email, a password reset link has been sent.
    </p>

    <form v-else class="flex flex-col gap-4" novalidate @submit="handleSubmit">
      <div class="flex flex-col gap-1.5">
        <label for="forgot-email" class="text-xs font-medium text-text-subtle">Email</label>
        <input
          id="forgot-email"
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

      <p v-if="status === 'error'" class="text-xs text-brand-accent" role="alert">
        {{ errorMessage }}
      </p>

      <AppButton type="submit" variant="primary" class="w-full" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Sending…' : 'Send reset link' }}
      </AppButton>
    </form>
  </div>
</template>
