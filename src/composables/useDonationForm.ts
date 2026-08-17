import { ref, type Ref } from 'vue'
import { submitDonation } from '@/services/firebase/firestore.service'
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
  readonly errorMessage: Ref<string>
  setAmountPreset: (value: DonationFormState['amountPreset']) => void
  setCustomAmount: (value: string) => void
  setFrequency: (value: DonationFrequency) => void
  setName: (value: string) => void
  setEmail: (value: string) => void
  setMessage: (value: string) => void
  submit: () => Promise<boolean>
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
  const errorMessage = ref<string>('')

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
    errorMessage.value = ''
  }

  async function submit(): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    try {
      await submitDonation({
        amount: resolveAmount(form.value),
        frequency: form.value.frequency,
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        message: form.value.message.trim(),
        createdAt: Date.now(),
      })
      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value =
        'Unable to submit your donation request right now. Please try again later.'
      return false
    }
  }

  return {
    form,
    errors,
    status,
    errorMessage,
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
