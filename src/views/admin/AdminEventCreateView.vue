<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AdminEventForm from '@/components/admin/AdminEventForm.vue'
import { useEventForm } from '@/composables/useEventForm'
import { useRouter } from 'vue-router'

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
  submitCreate,
} = useEventForm()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
  { label: 'Create Event' },
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
    <section class="bg-surface px-5 py-10 sm:px-8" aria-labelledby="create-event-heading">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h1 id="create-event-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Create Event
        </h1>
        <div class="max-w-2xl">
          <AdminEventForm
            :form="form"
            :errors="errors"
            :status="status"
            :error-message="errorMessage"
            :status-options="statusOptions"
            submit-label="Create Event"
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
