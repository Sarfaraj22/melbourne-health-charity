import { ref, type Ref } from 'vue'
import type {
  BookingFormErrors,
  BookingFormState,
  SupportType,
  TransportRequired,
} from '@/types/service'
import { getBookableServices } from '@/composables/useServicesContent'

export interface UseBookingFormReturn {
  readonly form: Ref<BookingFormState>
  readonly errors: Ref<BookingFormErrors>
  readonly isSubmitted: Ref<boolean>
  readonly isSubmitting: Ref<boolean>
  setName: (value: string) => void
  setDate: (value: string) => void
  setTime: (value: string) => void
  setServiceSlug: (value: string) => void
  setSupportType: (value: SupportType) => void
  setAccessibilityRequirements: (value: string) => void
  setTransportRequired: (value: TransportRequired) => void
  submit: () => boolean
  reset: () => void
}

function isBookableSlug(value: string): boolean {
  return getBookableServices().some((option) => option.slug === value)
}

function resolvedInitialSlug(initialServiceSlug: string): string {
  return isBookableSlug(initialServiceSlug) ? initialServiceSlug : ''
}

const initialFormState = (initialServiceSlug: string): BookingFormState => ({
  name: '',
  date: '',
  time: '',
  serviceSlug: resolvedInitialSlug(initialServiceSlug),
  supportType: '',
  accessibilityRequirements: '',
  transportRequired: 'no',
})

function validateForm(state: BookingFormState): BookingFormErrors {
  const errors: BookingFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.date) {
    errors.date = 'Please select a date for your appointment.'
  }

  if (!state.time) {
    errors.time = 'Please select a time for your appointment.'
  }

  if (!state.serviceSlug) {
    errors.serviceSlug = 'Please choose a service.'
  }

  if (!state.supportType) {
    errors.supportType = 'Please choose a support type.'
  }

  return errors
}

export function useBookingForm(initialServiceSlug: string): UseBookingFormReturn {
  const form = ref<BookingFormState>(initialFormState(initialServiceSlug))
  const errors = ref<BookingFormErrors>({})
  const isSubmitted = ref(false)
  const isSubmitting = ref(false)

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    const next = { ...errors.value }
    delete next.name
    errors.value = next
  }

  function setDate(value: string): void {
    form.value = { ...form.value, date: value }
    const next = { ...errors.value }
    delete next.date
    errors.value = next
  }

  function setTime(value: string): void {
    form.value = { ...form.value, time: value }
    const next = { ...errors.value }
    delete next.time
    errors.value = next
  }

  function setServiceSlug(value: string): void {
    if (!isBookableSlug(value)) {
      return
    }
    form.value = { ...form.value, serviceSlug: value }
    const next = { ...errors.value }
    delete next.serviceSlug
    errors.value = next
  }

  function setSupportType(value: SupportType): void {
    form.value = { ...form.value, supportType: value }
    const next = { ...errors.value }
    delete next.supportType
    errors.value = next
  }

  function setAccessibilityRequirements(value: string): void {
    form.value = { ...form.value, accessibilityRequirements: value }
  }

  function setTransportRequired(value: TransportRequired): void {
    form.value = { ...form.value, transportRequired: value }
  }

  function reset(): void {
    form.value = initialFormState(initialServiceSlug)
    errors.value = {}
    isSubmitted.value = false
    isSubmitting.value = false
  }

  function submit(): boolean {
    isSubmitting.value = true
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      isSubmitting.value = false
      return false
    }

    isSubmitted.value = true
    isSubmitting.value = false
    return true
  }

  return {
    form,
    errors,
    isSubmitted,
    isSubmitting,
    setName,
    setDate,
    setTime,
    setServiceSlug,
    setSupportType,
    setAccessibilityRequirements,
    setTransportRequired,
    submit,
    reset,
  }
}
