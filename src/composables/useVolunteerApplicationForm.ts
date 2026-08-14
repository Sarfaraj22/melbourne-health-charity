import { ref, type Ref } from 'vue'
import type {
  VolunteerApplicationFormErrors,
  VolunteerApplicationFormState,
  VolunteerApplicationStatus,
  VolunteerAvailability,
  VolunteerOpportunityCategory,
} from '@/types/volunteer'

export interface UseVolunteerApplicationFormReturn {
  readonly form: Ref<VolunteerApplicationFormState>
  readonly errors: Ref<VolunteerApplicationFormErrors>
  readonly status: Ref<VolunteerApplicationStatus>
  readonly availableInterests: readonly {
    readonly id: VolunteerOpportunityCategory
    readonly label: string
  }[]
  readonly availabilityOptions: readonly VolunteerAvailability[]
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  toggleInterest: (id: VolunteerOpportunityCategory) => void
  setAvailability: (value: VolunteerAvailability | '') => void
  setMessage: (value: string) => void
  submit: () => boolean
  reset: () => void
}

const availableInterests: readonly {
  readonly id: VolunteerOpportunityCategory
  readonly label: string
}[] = [
  { id: 'event-support', label: 'Event Support' },
  { id: 'companionship', label: 'Companionship' },
  { id: 'admin', label: 'Admin Support' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'mentoring', label: 'Mentoring' },
]

const availabilityOptions: readonly VolunteerAvailability[] = [
  'weekday',
  'weekend',
  'evening',
  'flexible',
]

const initialFormState = (): VolunteerApplicationFormState => ({
  name: '',
  email: '',
  phone: '',
  interests: new Set(),
  availability: '',
  message: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: VolunteerApplicationFormState): VolunteerApplicationFormErrors {
  const errors: VolunteerApplicationFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!state.phone.trim()) {
    errors.phone = 'Please enter a contact number.'
  }

  if (state.interests.size === 0) {
    errors.interests = 'Please choose at least one area of interest.'
  }

  if (!state.availability) {
    errors.availability = 'Please select your availability.'
  }

  return errors
}

export function useVolunteerApplicationForm(): UseVolunteerApplicationFormReturn {
  const form = ref<VolunteerApplicationFormState>(initialFormState())
  const errors = ref<VolunteerApplicationFormErrors>({})
  const status = ref<VolunteerApplicationStatus>('idle')

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    const next = { ...errors.value }
    delete next.name
    errors.value = next
  }

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    const next = { ...errors.value }
    delete next.email
    errors.value = next
  }

  function setPhone(value: string): void {
    form.value = { ...form.value, phone: value }
    const next = { ...errors.value }
    delete next.phone
    errors.value = next
  }

  function toggleInterest(id: VolunteerOpportunityCategory): void {
    const nextInterests = new Set(form.value.interests)
    if (nextInterests.has(id)) {
      nextInterests.delete(id)
    } else {
      nextInterests.add(id)
    }
    form.value = { ...form.value, interests: nextInterests }
    const next = { ...errors.value }
    delete next.interests
    errors.value = next
  }

  function setAvailability(value: VolunteerAvailability | ''): void {
    form.value = { ...form.value, availability: value }
    const next = { ...errors.value }
    delete next.availability
    errors.value = next
  }

  function setMessage(value: string): void {
    form.value = { ...form.value, message: value }
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
    availableInterests,
    availabilityOptions,
    setName,
    setEmail,
    setPhone,
    toggleInterest,
    setAvailability,
    setMessage,
    submit,
    reset,
  }
}
