import { ref, type Ref } from 'vue'
import {
  createVolunteer,
  logVolunteerHours,
  updateVolunteer,
} from '@/services/firebase/firestore.service'
import type {
  AdminFormStatus,
  AdminVolunteerStatus,
  VolunteerFormErrors,
  VolunteerFormState,
} from '@/types/admin'
import type { VolunteerRecordDoc } from '@/types/firestore'

export interface UseVolunteerFormReturn {
  readonly form: Ref<VolunteerFormState>
  readonly errors: Ref<VolunteerFormErrors>
  readonly status: Ref<AdminFormStatus>
  readonly errorMessage: Ref<string>
  readonly statusOptions: readonly AdminVolunteerStatus[]
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setStatus: (value: AdminVolunteerStatus) => void
  setTrainingPercent: (value: string) => void
  setHours: (value: string) => void
  submitCreate: () => Promise<boolean>
  submitUpdate: (id: string, previousHours: number) => Promise<boolean>
  reset: () => void
  initWith: (volunteer: VolunteerRecordDoc) => void
}

const statusOptions: readonly AdminVolunteerStatus[] = ['active', 'pending']

const initialFormState = (): VolunteerFormState => ({
  name: '',
  email: '',
  phone: '',
  status: 'pending',
  trainingPercent: '0',
  hours: '0',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(state: VolunteerFormState): VolunteerFormErrors {
  const errors: VolunteerFormErrors = {}

  if (!state.name.trim()) {
    errors.name = 'Please enter the volunteer name.'
  }

  if (!state.email.trim()) {
    errors.email = 'Please enter an email address.'
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  const trainingPercent = Number(state.trainingPercent)
  if (Number.isNaN(trainingPercent) || trainingPercent < 0 || trainingPercent > 100) {
    errors.trainingPercent = 'Training percentage must be between 0 and 100.'
  }

  const hours = Number(state.hours)
  if (Number.isNaN(hours) || hours < 0) {
    errors.hours = 'Hours must be a non-negative number.'
  }

  return errors
}

function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function useVolunteerForm(): UseVolunteerFormReturn {
  const form = ref<VolunteerFormState>(initialFormState())
  const errors = ref<VolunteerFormErrors>({})
  const status = ref<AdminFormStatus>('idle')
  const errorMessage = ref<string>('')

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
  }

  function setStatus(value: AdminVolunteerStatus): void {
    form.value = { ...form.value, status: value }
  }

  function setTrainingPercent(value: string): void {
    form.value = { ...form.value, trainingPercent: value }
    const next = { ...errors.value }
    delete next.trainingPercent
    errors.value = next
  }

  function setHours(value: string): void {
    form.value = { ...form.value, hours: value }
    const next = { ...errors.value }
    delete next.hours
    errors.value = next
  }

  function reset(): void {
    form.value = initialFormState()
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = ''
  }

  function initWith(volunteer: VolunteerRecordDoc): void {
    form.value = {
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      status: volunteer.status,
      trainingPercent: String(volunteer.trainingPercent),
      hours: String(volunteer.hours),
    }
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function submitCreate(): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    const hours = Number(form.value.hours)
    const trainingPercent = Number(form.value.trainingPercent)

    try {
      const volunteerId = await createVolunteer({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        status: form.value.status,
        trainingPercent,
        hours,
        createdAt: Date.now(),
      })

      if (hours > 0) {
        await logVolunteerHours({
          volunteerId,
          volunteerName: form.value.name.trim(),
          hours,
          month: currentMonthKey(),
          createdAt: Date.now(),
        })
      }

      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to create the volunteer record. Please try again later.'
      return false
    }
  }

  async function submitUpdate(id: string, previousHours: number): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''
    const validationErrors = validateForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    const hours = Number(form.value.hours)
    const trainingPercent = Number(form.value.trainingPercent)
    const hourDelta = hours - previousHours

    try {
      await updateVolunteer(id, {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        status: form.value.status,
        trainingPercent,
        hours,
      })

      if (hourDelta !== 0) {
        await logVolunteerHours({
          volunteerId: id,
          volunteerName: form.value.name.trim(),
          hours: Math.abs(hourDelta),
          month: currentMonthKey(),
          createdAt: Date.now(),
        })
      }

      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to update the volunteer record. Please try again later.'
      return false
    }
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    statusOptions,
    setName,
    setEmail,
    setPhone,
    setStatus,
    setTrainingPercent,
    setHours,
    submitCreate,
    submitUpdate,
    reset,
    initWith,
  }
}
