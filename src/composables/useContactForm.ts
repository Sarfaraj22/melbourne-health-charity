import { ref, type Ref } from 'vue'
import type { ContactFormErrors, ContactFormState, ContactFormStatus } from '@/types/contact'

export interface UseContactFormReturn {
  readonly form: Ref<ContactFormState>
  readonly errors: Ref<ContactFormErrors>
  readonly status: Ref<ContactFormStatus>
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setSubject: (value: string) => void
  setMessage: (value: string) => void
  submit: () => boolean
  reset: () => void
}

const initialFormState = (): ContactFormState => ({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: ContactFormState): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.subject.trim()) {
    errors.subject = 'Please enter a subject.'
  }

  if (!state.message.trim()) {
    errors.message = 'Please enter your message.'
  }

  return errors
}

function clearFieldError(errors: Ref<ContactFormErrors>, field: keyof ContactFormErrors): void {
  if (errors.value[field] === undefined) {
    return
  }
  const next: ContactFormErrors = { ...errors.value }
  delete next[field]
  errors.value = next
}

export function useContactForm(): UseContactFormReturn {
  const form = ref<ContactFormState>(initialFormState())
  const errors = ref<ContactFormErrors>({})
  const status = ref<ContactFormStatus>('idle')

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
    clearFieldError(errors, 'phone')
  }

  function setSubject(value: string): void {
    form.value = { ...form.value, subject: value }
    clearFieldError(errors, 'subject')
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

    // No backend yet: simulate a successful submission.
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
    setSubject,
    setMessage,
    submit,
    reset,
  }
}
