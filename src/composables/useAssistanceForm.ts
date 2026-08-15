import { ref, type Ref } from 'vue'
import type {
  AssistanceFormErrors,
  AssistanceFormState,
  AssistanceFormStatus,
} from '@/types/support'

export interface UseAssistanceFormReturn {
  readonly form: Ref<AssistanceFormState>
  readonly errors: Ref<AssistanceFormErrors>
  readonly status: Ref<AssistanceFormStatus>
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setNeed: (value: string) => void
  setMessage: (value: string) => void
  submit: () => boolean
  reset: () => void
}

const initialFormState = (): AssistanceFormState => ({
  name: '',
  email: '',
  phone: '',
  need: '',
  message: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: AssistanceFormState): AssistanceFormErrors {
  const errors: AssistanceFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.need.trim()) {
    errors.need = 'Please tell us what you need help with.'
  }

  if (!state.message.trim()) {
    errors.message = 'Please enter a short message.'
  }

  return errors
}

function clearFieldError(
  errors: Ref<AssistanceFormErrors>,
  field: keyof AssistanceFormErrors,
): void {
  if (errors.value[field] === undefined) {
    return
  }
  const next: AssistanceFormErrors = { ...errors.value }
  delete next[field]
  errors.value = next
}

export function useAssistanceForm(): UseAssistanceFormReturn {
  const form = ref<AssistanceFormState>(initialFormState())
  const errors = ref<AssistanceFormErrors>({})
  const status = ref<AssistanceFormStatus>('idle')

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    clearFieldError(errors, 'name')
  }

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    clearFieldError(errors, 'email')
  }

  function setPhone(value: string): void {
    form.value = { ...form.value, phone: value }
  }

  function setNeed(value: string): void {
    form.value = { ...form.value, need: value }
    clearFieldError(errors, 'need')
  }

  function setMessage(value: string): void {
    form.value = { ...form.value, message: value }
    clearFieldError(errors, 'message')
  }

  function reset(): void {
    form.value = initialFormState()
    errors.value = {}
    status.value = 'idle'
  }

  function submit(): boolean {
    status.value = 'submitting'
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    status.value = 'success'
    return true
  }

  return {
    form,
    errors,
    status,
    setName,
    setEmail,
    setPhone,
    setNeed,
    setMessage,
    submit,
    reset,
  }
}
