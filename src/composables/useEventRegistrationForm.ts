import { ref, type Ref } from 'vue'
import { submitEventRegistration } from '@/services/firebase/firestore.service'
import type { EventRegistrationFormErrors, EventRegistrationFormState } from '@/types/event'

export interface UseEventRegistrationFormReturn {
  readonly form: Ref<EventRegistrationFormState>
  readonly errors: Ref<EventRegistrationFormErrors>
  readonly isSubmitted: Ref<boolean>
  readonly isSubmitting: Ref<boolean>
  readonly isError: Ref<boolean>
  readonly errorMessage: Ref<string>
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setAttendees: (value: string) => void
  setAccessibilityRequirements: (value: string) => void
  setOptInUpdates: (value: boolean) => void
  submit: () => Promise<boolean>
  reset: () => void
}

const initialFormState = (): EventRegistrationFormState => ({
  name: '',
  email: '',
  phone: '',
  attendees: '1',
  accessibilityRequirements: '',
  optInUpdates: false,
})

// Pragmatic, intentionally permissive patterns — validation is a UX cue, not a security boundary.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9()+\-\s]{6,20}$/

function validateForm(state: EventRegistrationFormState): EventRegistrationFormErrors {
  const errors: EventRegistrationFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.phone.trim()) {
    errors.phone = 'Please enter your phone number.'
  } else if (!PHONE_PATTERN.test(state.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.'
  }

  const attendees = Number.parseInt(state.attendees, 10)
  if (Number.isNaN(attendees) || attendees < 1) {
    errors.attendees = 'Please enter at least one attendee.'
  }

  return errors
}

export function useEventRegistrationForm(eventSlug: string): UseEventRegistrationFormReturn {
  const form = ref<EventRegistrationFormState>(initialFormState())
  const errors = ref<EventRegistrationFormErrors>({})
  const isSubmitted = ref(false)
  const isSubmitting = ref(false)
  const isError = ref(false)
  const errorMessage = ref<string>('')

  function clearError(field: keyof EventRegistrationFormErrors): void {
    const next = { ...errors.value }
    delete next[field]
    errors.value = next
  }

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    clearError('name')
  }

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    clearError('email')
  }

  function setPhone(value: string): void {
    form.value = { ...form.value, phone: value }
    clearError('phone')
  }

  function setAttendees(value: string): void {
    form.value = { ...form.value, attendees: value }
    clearError('attendees')
  }

  function setAccessibilityRequirements(value: string): void {
    form.value = { ...form.value, accessibilityRequirements: value }
  }

  function setOptInUpdates(value: boolean): void {
    form.value = { ...form.value, optInUpdates: value }
  }

  function reset(): void {
    form.value = initialFormState()
    errors.value = {}
    isSubmitted.value = false
    isSubmitting.value = false
    isError.value = false
    errorMessage.value = ''
  }

  async function submit(): Promise<boolean> {
    isSubmitting.value = true
    isError.value = false
    errorMessage.value = ''
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      isSubmitting.value = false
      return false
    }

    try {
      await submitEventRegistration({
        eventSlug,
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        attendees: form.value.attendees,
        accessibilityRequirements: form.value.accessibilityRequirements.trim(),
        optInUpdates: form.value.optInUpdates,
        createdAt: Date.now(),
      })
      isSubmitted.value = true
      isSubmitting.value = false
      return true
    } catch {
      isSubmitting.value = false
      isError.value = true
      errorMessage.value = 'Unable to submit your registration right now. Please try again later.'
      return false
    }
  }

  return {
    form,
    errors,
    isSubmitted,
    isSubmitting,
    isError,
    errorMessage,
    setName,
    setEmail,
    setPhone,
    setAttendees,
    setAccessibilityRequirements,
    setOptInUpdates,
    submit,
    reset,
  }
}
