<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import ResourcePagination from '@/components/resources/ResourcePagination.vue'
import { useAdminDataTable } from '@/composables/useAdminDataTable'
import { manageAuthUser } from '@/services/firebase/functions.service'
import { useAuthStore } from '@/stores/auth.store'
import type { AdminProfile } from '@/types/admin'
import type { ManageAuthUserAction } from '@/types/functions'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly profiles: readonly AdminProfile[]
}

interface PendingAction {
  readonly uid: string
  readonly action: ManageAuthUserAction
}

const props = defineProps<Props>()
const authStore = useAuthStore()

const actingUid = ref<string>('')
const errorMessage = ref<string>('')
const pending = ref<PendingAction | undefined>(undefined)

function profileSortValue(row: AdminProfile, key: string): string | number {
  switch (key) {
    case 'displayName':
      return row.displayName.toLowerCase()
    case 'email':
      return row.email.toLowerCase()
    case 'role':
      return row.role
    case 'status':
      return row.disabled ? 'disabled' : 'active'
    case 'createdAt':
      return row.createdAt
    default:
      return ''
  }
}

const {
  searchQuery,
  pagedRows,
  filteredRows,
  totalFiltered,
  totalPages,
  page,
  rangeStart,
  rangeEnd,
  setSearchQuery,
  toggleSort,
  goToPage,
  ariaSortFor,
} = useAdminDataTable<AdminProfile>({
  rows: (): readonly AdminProfile[] => props.profiles,
  searchFields: ['displayName', 'email', 'role'],
  pageSize: 10,
  defaultSortKey: 'displayName',
  defaultSortDirection: 'asc',
  getSortValue: profileSortValue,
})

function handleSearchInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setSearchQuery(target.value)
  }
}

function sortIndicator(key: string): string {
  const order = ariaSortFor(key)
  if (order === 'ascending') {
    return '▲'
  }
  if (order === 'descending') {
    return '▼'
  }
  return '↕'
}

function roleLabel(role: AdminProfile['role']): string {
  if (role === 'admin') {
    return 'Admin'
  }
  if (role === 'volunteer') {
    return 'Volunteer'
  }
  return 'User'
}

function canManage(profile: AdminProfile): boolean {
  if (profile.role === 'admin') {
    return false
  }
  return profile.uid !== authStore.user?.uid
}

function requestAction(profile: AdminProfile, action: ManageAuthUserAction): void {
  if (!canManage(profile)) {
    return
  }
  errorMessage.value = ''
  pending.value = { uid: profile.uid, action }
}

function cancelPending(): void {
  pending.value = undefined
}

async function confirmPending(): Promise<void> {
  const next = pending.value
  if (next === undefined) {
    return
  }
  actingUid.value = next.uid
  errorMessage.value = ''
  try {
    await manageAuthUser({ uid: next.uid, action: next.action })
    pending.value = undefined
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to update this account.'
  } finally {
    actingUid.value = ''
  }
}

const confirmLabel = computed<string>(() => {
  const next = pending.value
  if (next === undefined) {
    return 'Confirm'
  }
  if (next.action === 'delete') {
    return 'Confirm delete'
  }
  if (next.action === 'disable') {
    return 'Confirm disable'
  }
  return 'Confirm enable'
})
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-users-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <h2 id="admin-users-heading" class="text-2xl font-bold text-text-default">User Management</h2>
      <p class="text-sm text-text-muted">
        Search registered accounts. You can disable or delete users and volunteers. Admin accounts
        cannot be changed here.
      </p>

      <div class="flex flex-col gap-1.5">
        <label for="admin-user-search" class="text-xs font-medium text-text-subtle">
          Search users
        </label>
        <input
          id="admin-user-search"
          type="search"
          :value="searchQuery"
          placeholder="Search by name, email, or role"
          class="w-full max-w-md rounded border border-border-strong bg-surface px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleSearchInput"
        />
      </div>

      <p v-if="errorMessage.length > 0" class="text-sm text-brand-donate" role="alert">
        {{ errorMessage }}
      </p>

      <div
        v-if="profiles.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No registered accounts yet.</p>
      </div>

      <div
        v-else-if="filteredRows.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No accounts match your search.</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div class="overflow-x-auto rounded-md border border-border-default">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border-default bg-surface-muted">
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('displayName')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('displayName')"
                  >
                    Name {{ sortIndicator('displayName') }}
                  </button>
                </th>
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('email')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-label="Sort by email"
                    @click="toggleSort('email')"
                  >
                    Email {{ sortIndicator('email') }}
                  </button>
                </th>
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('role')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('role')"
                  >
                    Role {{ sortIndicator('role') }}
                  </button>
                </th>
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('status')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('status')"
                  >
                    Status {{ sortIndicator('status') }}
                  </button>
                </th>
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('createdAt')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('createdAt')"
                  >
                    Created {{ sortIndicator('createdAt') }}
                  </button>
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
                v-for="profile in pagedRows"
                :key="profile.uid"
                class="border-b border-border-default last:border-b-0"
              >
                <td class="px-5 py-4 text-sm text-text-default">{{ profile.displayName }}</td>
                <td class="px-5 py-4 text-sm text-text-default">{{ profile.email }}</td>
                <td class="px-5 py-4 text-sm text-text-default">{{ roleLabel(profile.role) }}</td>
                <td class="px-5 py-4 text-sm text-text-default">
                  {{ profile.disabled ? 'Disabled' : 'Active' }}
                </td>
                <td class="px-5 py-4 text-sm text-text-default">
                  {{ formatMillisAsDdMmYyyy(profile.createdAt) }}
                </td>
                <td class="px-5 py-4 text-right">
                  <div
                    v-if="canManage(profile)"
                    class="flex flex-wrap items-center justify-end gap-2"
                  >
                    <template v-if="pending !== undefined && pending.uid === profile.uid">
                      <AppButton
                        type="button"
                        size="xs"
                        :disabled="actingUid === profile.uid"
                        @click="confirmPending"
                      >
                        {{ actingUid === profile.uid ? 'Working...' : confirmLabel }}
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="xs"
                        :disabled="actingUid === profile.uid"
                        @click="cancelPending"
                      >
                        Cancel
                      </AppButton>
                    </template>
                    <template v-else>
                      <button
                        v-if="profile.disabled"
                        type="button"
                        class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        @click="requestAction(profile, 'enable')"
                      >
                        Enable
                      </button>
                      <button
                        v-else
                        type="button"
                        class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        @click="requestAction(profile, 'disable')"
                      >
                        Disable
                      </button>
                      <button
                        type="button"
                        class="text-sm font-bold text-text-default underline hover:text-brand-donate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        @click="requestAction(profile, 'delete')"
                      >
                        Delete
                      </button>
                    </template>
                  </div>
                  <span v-else class="text-sm text-text-subtle">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-text-subtle">
            Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalFiltered }}
          </p>
          <ResourcePagination
            v-if="totalPages > 1"
            :current-page="page"
            :total-pages="totalPages"
            @go-to-page="goToPage"
          />
        </div>
      </div>
    </div>
  </section>
</template>
