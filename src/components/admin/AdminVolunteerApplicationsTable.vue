<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { reviewVolunteerApplication } from '@/services/firebase/functions.service'
import type { AdminVolunteerApplication } from '@/types/admin'

interface Props {
  readonly applications: readonly AdminVolunteerApplication[]
}

defineProps<Props>()

const reviewingId = ref<string>('')
const reviewError = ref<string>('')

async function handleReview(applicationId: string, decision: 'approved' | 'denied'): Promise<void> {
  reviewingId.value = applicationId
  reviewError.value = ''
  try {
    await reviewVolunteerApplication({ applicationId, decision })
  } catch (error) {
    reviewError.value =
      error instanceof Error ? error.message : 'Unable to review this application.'
  } finally {
    reviewingId.value = ''
  }
}

function statusLabel(status: AdminVolunteerApplication['status']): string {
  if (status === 'approved') {
    return 'Approved'
  }
  if (status === 'denied') {
    return 'Denied'
  }
  return 'Pending'
}

function interestsLabel(interests: readonly string[]): string {
  return interests.join(', ')
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-applications-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="admin-applications-heading" class="text-2xl font-bold text-text-default">
        Volunteer Applications
      </h2>
      <p v-if="reviewError" class="text-sm text-brand-donate" role="alert">{{ reviewError }}</p>
      <div
        v-if="applications.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No volunteer applications yet.</p>
      </div>
      <div v-else class="overflow-x-auto rounded-md border border-border-default">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border-default bg-surface-muted">
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Phone
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Address
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Interests
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Availability
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Message
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="application in applications"
              :key="application.id"
              class="border-b border-border-default last:border-b-0"
            >
              <td class="px-5 py-4 text-sm font-bold text-text-default">{{ application.name }}</td>
              <td class="px-5 py-4 text-sm text-text-default">{{ application.email }}</td>
              <td class="px-5 py-4 text-sm text-text-default">{{ application.phone }}</td>
              <td class="px-5 py-4 text-sm text-text-default">{{ application.address }}</td>
              <td class="px-5 py-4 text-sm text-text-default">
                {{ interestsLabel(application.interests) }}
              </td>
              <td class="px-5 py-4 text-sm text-text-default">{{ application.availability }}</td>
              <td class="px-5 py-4 text-sm text-text-muted">{{ application.message }}</td>
              <td class="px-5 py-4 text-sm text-text-default">
                {{ statusLabel(application.status) }}
              </td>
              <td class="px-5 py-4 text-right">
                <div v-if="application.status === 'pending'" class="flex justify-end gap-2">
                  <AppButton
                    type="button"
                    variant="primary"
                    size="sm"
                    :disabled="reviewingId.length > 0"
                    @click="handleReview(application.id, 'approved')"
                  >
                    Approve
                  </AppButton>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    :disabled="reviewingId.length > 0"
                    @click="handleReview(application.id, 'denied')"
                  >
                    Deny
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
