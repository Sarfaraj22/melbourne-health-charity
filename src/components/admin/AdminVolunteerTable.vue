<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import ResourcePagination from '@/components/resources/ResourcePagination.vue'
import { useAdminDataTable } from '@/composables/useAdminDataTable'
import type { AdminVolunteer } from '@/types/admin'
import { downloadVolunteerCsv, downloadVolunteerPdf } from '@/utils/volunteerExport'

interface Props {
  readonly volunteers: readonly AdminVolunteer[]
}

interface Emits {
  (event: 'edit', id: string): void
  (event: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function volunteerSortValue(row: AdminVolunteer, key: string): string | number {
  switch (key) {
    case 'name':
      return row.name.toLowerCase()
    case 'status':
      return row.status
    case 'trainingPercent':
      return row.trainingPercent
    case 'hours':
      return row.hours
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
} = useAdminDataTable<AdminVolunteer>({
  rows: (): readonly AdminVolunteer[] => props.volunteers,
  searchFields: ['name', 'email', 'phone', 'address', 'status'],
  pageSize: 10,
  getSortValue: volunteerSortValue,
})

function handleDelete(id: string): void {
  emit('delete', id)
}

function handleCsv(): void {
  downloadVolunteerCsv(filteredRows.value)
}

function handlePdf(): void {
  downloadVolunteerPdf(filteredRows.value)
}

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
  return ''
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-volunteer-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="admin-volunteer-heading" class="text-2xl font-bold text-text-default">
          Volunteer Management
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <AppButton type="button" variant="secondary" size="sm" @click="handleCsv">
            Download CSV
          </AppButton>
          <AppButton type="button" variant="secondary" size="sm" @click="handlePdf">
            Download PDF
          </AppButton>
          <router-link
            to="/admin/volunteers/new"
            class="inline-flex items-center justify-center rounded bg-brand-primary px-4 py-2 text-sm font-bold text-text-on-brand hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            + Add Volunteer
          </router-link>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="admin-volunteer-search" class="text-xs font-medium text-text-subtle">
          Search volunteers
        </label>
        <input
          id="admin-volunteer-search"
          type="search"
          :value="searchQuery"
          placeholder="Search by name, email, phone, address, or status"
          class="w-full max-w-md rounded border border-border-strong bg-surface px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @input="handleSearchInput"
        />
      </div>

      <div
        v-if="volunteers.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">
          No volunteers yet. Click "Add Volunteer" to create one.
        </p>
      </div>

      <div
        v-else-if="filteredRows.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No volunteers match your search.</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div class="overflow-x-auto rounded-md border border-border-default">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border-default bg-surface-muted">
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('name')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('name')"
                  >
                    Name {{ sortIndicator('name') }}
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
                  :aria-sort="ariaSortFor('trainingPercent')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('trainingPercent')"
                  >
                    Training {{ sortIndicator('trainingPercent') }}
                  </button>
                </th>
                <th
                  scope="col"
                  :aria-sort="ariaSortFor('hours')"
                  class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
                >
                  <button
                    type="button"
                    class="font-medium uppercase tracking-wide text-text-subtle hover:text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="toggleSort('hours')"
                  >
                    Hours {{ sortIndicator('hours') }}
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
                v-for="volunteer in pagedRows"
                :key="volunteer.id"
                class="border-b border-border-default last:border-b-0"
              >
                <td class="px-5 py-4 text-sm font-bold text-text-default">{{ volunteer.name }}</td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                      volunteer.status === 'active'
                        ? 'bg-brand-primary text-text-on-brand'
                        : 'border border-border-strong text-text-muted',
                    ]"
                  >
                    {{ volunteer.status === 'active' ? 'Active' : 'Pending' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-sm text-text-default">
                  {{ volunteer.trainingPercent }}%
                </td>
                <td class="px-5 py-4 text-sm text-text-default">{{ volunteer.hours }} hrs</td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3">
                    <router-link
                      :to="`/admin/volunteers/${volunteer.id}/edit`"
                      class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      Edit
                    </router-link>
                    <button
                      type="button"
                      class="text-sm font-bold text-text-default underline hover:text-brand-donate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                      @click="handleDelete(volunteer.id)"
                    >
                      Delete
                    </button>
                  </div>
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
