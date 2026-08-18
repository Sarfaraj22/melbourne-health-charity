import { ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import {
  fieldErrorsFromAuthError,
  type AuthResult,
  type LoginFormErrors,
  type LoginFormState,
} from '@/types/auth'

export interface UseLoginFormReturn {
  readonly form: Ref<LoginFormState>
  readonly errors: Ref<LoginFormErrors>
  readonly status: Ref<'idle' | 'submitting' | 'error'>
  readonly errorMessage: Ref<string>
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  submit: () => Promise<AuthResult>
  reset: () => void
}

const initialFormState = (): LoginFormState => ({
  email: '',
  password: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.password) {
    errors.password = 'Please enter your password.'
  }

  return errors
}

function clearFieldError(errors: Ref<LoginFormErrors>, field: keyof LoginFormErrors): void {
  if (errors.value[field] === undefined) {
    return
  }
  const next: LoginFormErrors = { ...errors.value }
  delete next[field]
  errors.value = next
}

export function useLoginForm(): UseLoginFormReturn {
  const authStore = useAuthStore()
  const form = ref<LoginFormState>(initialFormState())
  const errors = ref<LoginFormErrors>({})
  const status = ref<'idle' | 'submitting' | 'error'>('idle')
  const errorMessage = ref<string>('')

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    clearFieldError(errors, 'email')
  }

  function setPassword(value: string): void {
    form.value = { ...form.value, password: value }
    clearFieldError(errors, 'password')
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
    const result = await authStore.signIn(form.value.email.trim(), form.value.password)
    if (!result.success) {
      status.value = 'error'
      errorMessage.value = result.error?.message ?? 'Unable to sign in. Please try again.'
      errors.value = { ...errors.value, ...fieldErrorsFromAuthError(result.error) }
      return result
    }
    status.value = 'idle'
    return result
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    setEmail,
    setPassword,
    submit,
    reset,
  }
}
