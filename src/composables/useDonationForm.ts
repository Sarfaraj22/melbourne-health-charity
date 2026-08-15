import { ref, type Ref } from 'vue'
import type {
  DonationFormErrors,
  DonationFormState,
  DonationFormStatus,
  DonationFrequency,
} from '@/types/donate'

export interface UseDonationFormReturn {
  readonly form: Ref<DonationFormState>
  readonly errors: Ref<DonationFormErrors>
  readonly status: Ref<DonationFormStatus>
  setAmountPreset: (value: DonationFormState['amountPreset']) => void
  setCustomAmount: (value: string) => void
  setFrequency: (value: DonationFrequency) => void
  setName: (value: string) => void
  setEmail: (value: string) => void
  setMessage: (value: string) => void
  submit: () => boolean
  reset: () => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialFormState = (): DonationFormState => ({
  amountPreset: '50',
  customAmount: '',
  frequency: 'one-off',
  name: '',
  email: '',
  message: '',
})

function resolveAmount(state: DonationFormState): number {
  if (state.amountPreset !== 'custom') {
    return Number.parseInt(state.amountPreset, 10)
  }
  return Number.parseFloat(state.customAmount)
}

function validateForm(state: DonationFormState): DonationFormErrors {
  const errors: DonationFormErrors = {}
  const amount = resolveAmount(state)

  if (!Number.isFinite(amount) || amount < 2) {
    errors.amount = 'Please enter an amount of at least $2.'
  }

  if (!state.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

function clearFieldError(errors: Ref<DonationFormErrors>, field: keyof DonationFormErrors): void {
  if (errors.value[field] === undefined) {
    return
  }
  const next: DonationFormErrors = { ...errors.value }
  delete next[field]
  errors.value = next
}

export function useDonationForm(): UseDonationFormReturn {
  const form = ref<DonationFormState>(initialFormState())
  const errors = ref<DonationFormErrors>({})
  const status = ref<DonationFormStatus>('idle')

  function setAmountPreset(value: DonationFormState['amountPreset']): void {
    form.value = { ...form.value, amountPreset: value }
    clearFieldError(errors, 'amount')
  }

  function setCustomAmount(value: string): void {
    form.value = { ...form.value, customAmount: value, amountPreset: 'custom' }
    clearFieldError(errors, 'amount')
  }

  function setFrequency(value: DonationFrequency): void {
    form.value = { ...form.value, frequency: value }
  }

  function setName(value: string): void {
    form.value = { ...form.value, name: value }
    clearFieldError(errors, 'name')
  }

  function setEmail(value: string): void {
    form.value = { ...form.value, email: value }
    clearFieldError(errors, 'email')
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

    status.value = 'success'
    return true
  }

  return {
    form,
    errors,
    status,
    setAmountPreset,
    setCustomAmount,
    setFrequency,
    setName,
    setEmail,
    setMessage,
    submit,
    reset,
  }
}
