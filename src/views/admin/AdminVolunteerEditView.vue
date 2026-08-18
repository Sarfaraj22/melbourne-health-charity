<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AdminVolunteerForm from '@/components/admin/AdminVolunteerForm.vue'
import { useVolunteerForm } from '@/composables/useVolunteerForm'
import { getVolunteerById } from '@/services/firebase/firestore.service'
import { useRouter } from 'vue-router'
import type { VolunteerRecordDoc } from '@/types/firestore'

const props = defineProps<{ readonly id: string }>()
const router = useRouter()

const {
  form,
  errors,
  status,
  errorMessage,
  statusOptions,
  setName,
  setEmail,
  setPhone,
  setAddress,
  setStatus,
  setTrainingPercent,
  setHours,
  submitUpdate,
  initWith,
} = useVolunteerForm()

const loadingRecord = ref<boolean>(true)
const loadError = ref<string>('')
const previousHours = ref<number>(0)

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
  { label: 'Edit Volunteer' },
]

onMounted(async () => {
  try {
    const volunteer: VolunteerRecordDoc | undefined = await getVolunteerById(props.id)
    if (volunteer === undefined) {
      loadError.value = 'Volunteer not found.'
      loadingRecord.value = false
      return
    }
    previousHours.value = volunteer.hours
    initWith(volunteer)
    loadingRecord.value = false
  } catch {
    loadError.value = 'Unable to load the volunteer record.'
    loadingRecord.value = false
  }
})

async function handleSubmit(): Promise<void> {
  const success = await submitUpdate(props.id, previousHours.value)
  if (success) {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <section class="bg-surface px-5 py-10 sm:px-8" aria-labelledby="edit-volunteer-heading">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h1 id="edit-volunteer-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Edit Volunteer
        </h1>
        <div v-if="loadingRecord" class="py-10 text-center">
          <p class="text-base text-text-muted">Loading...</p>
        </div>
        <div v-else-if="loadError" class="py-10 text-center">
          <p class="text-base text-brand-donate">{{ loadError }}</p>
        </div>
        <div v-else class="max-w-2xl">
          <AdminVolunteerForm
            :form="form"
            :errors="errors"
            :status="status"
            :error-message="errorMessage"
            :status-options="statusOptions"
            submit-label="Save Changes"
            @update-name="setName"
            @update-email="setEmail"
            @update-phone="setPhone"
            @update-address="setAddress"
            @update-status="setStatus"
            @update-training-percent="setTrainingPercent"
            @update-hours="setHours"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </section>
  </div>
</template>
