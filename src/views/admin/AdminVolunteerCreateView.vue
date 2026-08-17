<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AdminVolunteerForm from '@/components/admin/AdminVolunteerForm.vue'
import { useVolunteerForm } from '@/composables/useVolunteerForm'
import { useRouter } from 'vue-router'

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
  setStatus,
  setTrainingPercent,
  setHours,
  submitCreate,
} = useVolunteerForm()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
  { label: 'Add Volunteer' },
]

async function handleSubmit(): Promise<void> {
  const success = await submitCreate()
  if (success) {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <section class="bg-surface px-5 py-10 sm:px-8" aria-labelledby="add-volunteer-heading">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h1 id="add-volunteer-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Add Volunteer
        </h1>
        <div class="max-w-2xl">
          <AdminVolunteerForm
            :form="form"
            :errors="errors"
            :status="status"
            :error-message="errorMessage"
            :status-options="statusOptions"
            submit-label="Create Volunteer"
            @update-name="setName"
            @update-email="setEmail"
            @update-phone="setPhone"
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
