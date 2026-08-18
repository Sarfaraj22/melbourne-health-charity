import { ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import {
  fieldErrorsFromAuthError,
  type AuthResult,
  type ForgotPasswordFormErrors,
  type ForgotPasswordFormState,
} from '@/types/auth'

export interface UseForgotPasswordFormReturn {
  readonly form: Ref<ForgotPasswordFormState>
  readonly errors: Ref<ForgotPasswordFormErrors>
  readonly status: Ref<'idle' | 'submitting' | 'success' | 'error'>
  readonly errorMessage: Ref<string>
  setEmail: (value: string) => void
  submit: () => Promise<AuthResult>
  reset: () => void
}

const initialFormState = (): ForgotPasswordFormState => ({
  email: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: ForgotPasswordFormState): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {}

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const authStore = useAuthStore()
  const form = ref<ForgotPasswordFormState>(initialFormState())
  const errors = ref<ForgotPasswordFormErrors>({})
  const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const errorMessage = ref<string>('')

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    if (errors.value.email !== undefined) {
      errors.value = {}
    }
  }

  function reset(): void {
    form.value = initialFormState()
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function submit(): Promise<AuthResult> {
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      return { success: false }
    }

    status.value = 'submitting'
    errorMessage.value = ''
    const result = await authStore.sendPasswordReset(form.value.email.trim())
    if (!result.success) {
      status.value = 'error'
      errorMessage.value = result.error?.message ?? 'Unable to send reset email. Please try again.'
      const fieldErrors = fieldErrorsFromAuthError(result.error)
      if (fieldErrors.email !== undefined) {
        errors.value = { ...errors.value, email: fieldErrors.email }
      }
      return result
    }
    status.value = 'success'
    return result
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    setEmail,
    submit,
    reset,
  }
}
