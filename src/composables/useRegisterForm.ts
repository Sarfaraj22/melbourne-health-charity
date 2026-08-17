import { ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResult, RegisterFormErrors, RegisterFormState } from '@/types/auth'

export interface UseRegisterFormReturn {
  readonly form: Ref<RegisterFormState>
  readonly errors: Ref<RegisterFormErrors>
  readonly status: Ref<'idle' | 'submitting' | 'error'>
  readonly errorMessage: Ref<string>
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setConfirmPassword: (value: string) => void
  submit: () => Promise<AuthResult>
  reset: () => void
}

const initialFormState = (): RegisterFormState => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: RegisterFormState): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.password) {
    errors.password = 'Please enter a password.'
  } else if (state.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!state.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (state.password !== state.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

function clearFieldError(errors: Ref<RegisterFormErrors>, field: keyof RegisterFormErrors): void {
  if (errors.value[field] === undefined) {
    return
  }
  const next: RegisterFormErrors = { ...errors.value }
  delete next[field]
  errors.value = next
}

export function useRegisterForm(): UseRegisterFormReturn {
  const authStore = useAuthStore()
  const form = ref<RegisterFormState>(initialFormState())
  const errors = ref<RegisterFormErrors>({})
  const status = ref<'idle' | 'submitting' | 'error'>('idle')
  const errorMessage = ref<string>('')

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    clearFieldError(errors, 'name')
  }

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    clearFieldError(errors, 'email')
  }

  function setPassword(value: string): void {
    form.value = { ...form.value, password: value }
    clearFieldError(errors, 'password')
  }

  function setConfirmPassword(value: string): void {
    form.value = { ...form.value, confirmPassword: value }
    clearFieldError(errors, 'confirmPassword')
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
    const result = await authStore.register(
      form.value.name.trim(),
      form.value.email.trim(),
      form.value.password,
    )
    if (!result.success) {
      status.value = 'error'
      errorMessage.value =
        result.error?.message ?? 'Unable to create your account. Please try again.'
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
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    submit,
    reset,
  }
}
