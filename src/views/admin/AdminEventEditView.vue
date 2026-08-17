<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AdminEventForm from '@/components/admin/AdminEventForm.vue'
import { useEventForm } from '@/composables/useEventForm'
import { getEventById } from '@/services/firebase/firestore.service'
import { useRouter } from 'vue-router'
import type { EventRecordDoc } from '@/types/firestore'

const props = defineProps<{ readonly id: string }>()
const router = useRouter()

const {
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
  submitUpdate,
  initWith,
} = useEventForm()

const loadingRecord = ref<boolean>(true)
const loadError = ref<string>('')

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
  { label: 'Edit Event' },
]

onMounted(async () => {
  try {
    const event: EventRecordDoc | undefined = await getEventById(props.id)
    if (event === undefined) {
      loadError.value = 'Event not found.'
      loadingRecord.value = false
      return
    }
    initWith(event)
    loadingRecord.value = false
  } catch {
    loadError.value = 'Unable to load the event record.'
    loadingRecord.value = false
  }
})

async function handleSubmit(): Promise<void> {
  const success = await submitUpdate(props.id)
  if (success) {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <section class="bg-surface px-5 py-10 sm:px-8" aria-labelledby="edit-event-heading">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h1 id="edit-event-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Edit Event
        </h1>
        <div v-if="loadingRecord" class="py-10 text-center">
          <p class="text-base text-text-muted">Loading...</p>
        </div>
        <div v-else-if="loadError" class="py-10 text-center">
          <p class="text-base text-brand-donate">{{ loadError }}</p>
        </div>
        <div v-else class="max-w-2xl">
          <AdminEventForm
            :form="form"
            :errors="errors"
            :status="status"
            :error-message="errorMessage"
            :status-options="statusOptions"
            submit-label="Save Changes"
            @update-title="setTitle"
            @update-slug="setSlug"
            @update-summary="setSummary"
            @update-description="setDescription"
            @update-date="setDate"
            @update-time="setTime"
            @update-location="setLocation"
            @update-status="setStatus"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </section>
  </div>
</template>
