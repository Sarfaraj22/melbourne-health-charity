import { ref, type Ref } from 'vue'
import { createEvent, updateEvent } from '@/services/firebase/firestore.service'
import type {
  AdminEventStatus,
  AdminFormStatus,
  EventFormErrors,
  EventFormState,
} from '@/types/admin'
import type { EventRecordDoc } from '@/types/firestore'
import { isValidDateDdMmYyyy } from '@/utils/datetime'

export interface UseEventFormReturn {
  readonly form: Ref<EventFormState>
  readonly errors: Ref<EventFormErrors>
  readonly status: Ref<AdminFormStatus>
  readonly errorMessage: Ref<string>
  readonly statusOptions: readonly AdminEventStatus[]
  setTitle: (value: string) => void
  setSlug: (value: string) => void
  setSummary: (value: string) => void
  setDescription: (value: string) => void
  setDate: (value: string) => void
  setTime: (value: string) => void
  setLocation: (value: string) => void
  setStatus: (value: AdminEventStatus) => void
  submitCreate: () => Promise<boolean>
  submitUpdate: (id: string) => Promise<boolean>
  reset: () => void
  initWith: (event: EventRecordDoc) => void
}

const statusOptions: readonly AdminEventStatus[] = ['published', 'draft']

const initialFormState = (): EventFormState => ({
  title: '',
  slug: '',
  summary: '',
  description: '',
  date: '',
  time: '',
  location: '',
  status: 'draft',
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function validateForm(state: EventFormState): EventFormErrors {
  const errors: EventFormErrors = {}

  if (!state.title.trim()) {
    errors.title = 'Please enter the event title.'
  }

  if (!state.slug.trim()) {
    errors.slug = 'Please enter a slug or leave it blank to auto-generate.'
  }

  if (!isValidDateDdMmYyyy(state.date.trim())) {
    errors.date = 'Please select a date in DD-MM-YYYY format.'
  }

  return errors
}

export function useEventForm(): UseEventFormReturn {
  const form = ref<EventFormState>(initialFormState())
  const errors = ref<EventFormErrors>({})
  const status = ref<AdminFormStatus>('idle')
  const errorMessage = ref<string>('')

  function setTitle(value: string): void {
    form.value = { ...form.value, title: value }
    if (form.value.slug === '') {
      form.value = { ...form.value, slug: slugify(value) }
    }
    const next = { ...errors.value }
    delete next.title
    delete next.slug
    errors.value = next
  }

  function setSlug(value: string): void {
    form.value = { ...form.value, slug: slugify(value) }
    const next = { ...errors.value }
    delete next.slug
    errors.value = next
  }

  function setSummary(value: string): void {
    form.value = { ...form.value, summary: value }
  }

  function setDescription(value: string): void {
    form.value = { ...form.value, description: value }
  }

  function setDate(value: string): void {
    form.value = { ...form.value, date: value }
    const next = { ...errors.value }
    delete next.date
    errors.value = next
  }

  function setTime(value: string): void {
    form.value = { ...form.value, time: value }
  }

  function setLocation(value: string): void {
    form.value = { ...form.value, location: value }
  }

  function setStatus(value: AdminEventStatus): void {
    form.value = { ...form.value, status: value }
  }

  function reset(): void {
    form.value = initialFormState()
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = ''
  }

  function initWith(event: EventRecordDoc): void {
    form.value = {
      title: event.title,
      slug: event.slug,
      summary: event.summary,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      status: event.status,
    }
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function submitCreate(): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''

    const resolvedSlug = form.value.slug.trim() !== '' ? form.value.slug : slugify(form.value.title)
    const stateWithSlug: EventFormState = { ...form.value, slug: resolvedSlug }
    form.value = stateWithSlug

    const validationErrors = validateForm(stateWithSlug)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    try {
      await createEvent({
        title: form.value.title.trim(),
        slug: resolvedSlug,
        summary: form.value.summary.trim(),
        description: form.value.description.trim(),
        date: form.value.date.trim(),
        time: form.value.time.trim(),
        location: form.value.location.trim(),
        status: form.value.status,
        createdAt: Date.now(),
      })
      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to create the event record. Please try again later.'
      return false
    }
  }

  async function submitUpdate(id: string): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''

    const resolvedSlug = form.value.slug.trim() !== '' ? form.value.slug : slugify(form.value.title)
    const stateWithSlug: EventFormState = { ...form.value, slug: resolvedSlug }
    form.value = stateWithSlug

    const validationErrors = validateForm(stateWithSlug)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length > 0) {
      status.value = 'idle'
      return false
    }

    try {
      await updateEvent(id, {
        title: form.value.title.trim(),
        slug: resolvedSlug,
        summary: form.value.summary.trim(),
        description: form.value.description.trim(),
        date: form.value.date.trim(),
        time: form.value.time.trim(),
        location: form.value.location.trim(),
        status: form.value.status,
      })
      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to update the event record. Please try again later.'
      return false
    }
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    statusOptions,
    setTitle,
    setSlug,
    setSummary,
    setDescription,
    setDate,
    setTime,
    setLocation,
    setStatus,
    submitCreate,
    submitUpdate,
    reset,
    initWith,
  }
}
