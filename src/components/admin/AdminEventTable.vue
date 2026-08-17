<script setup lang="ts">
import type { AdminEvent } from '@/types/admin'

interface Props {
  readonly events: readonly AdminEvent[]
}

interface Emits {
  (event: 'publish', id: string): void
  (event: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handlePublish(id: string): void {
  emit('publish', id)
}

function handleDelete(id: string): void {
  emit('delete', id)
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-event-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <h2 id="admin-event-heading" class="text-2xl font-bold text-text-default">
          Event Management
        </h2>
        <router-link
          to="/admin/events/new"
          class="inline-flex items-center justify-center rounded bg-brand-primary px-4 py-2 text-sm font-bold text-text-on-brand hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          + Create Event
        </router-link>
      </div>

      <div
        v-if="events.length === 0"
        class="rounded-md border border-border-default p-6 text-center"
      >
        <p class="text-sm text-text-muted">No events yet. Click "Create Event" to create one.</p>
      </div>

      <div v-else class="overflow-x-auto rounded-md border border-border-default">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border-default bg-surface-muted">
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Event
              </th>
              <th
                scope="col"
                class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-subtle"
              >
                Date
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
              v-for="event in events"
              :key="event.id"
              class="border-b border-border-default last:border-b-0"
            >
              <td class="px-5 py-4 text-sm font-bold text-text-default">{{ event.title }}</td>
              <td class="px-5 py-4 text-sm text-text-default">{{ event.date }}</td>
              <td class="px-5 py-4">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                    event.status === 'published'
                      ? 'bg-brand-primary text-text-on-brand'
                      : 'border border-border-strong text-text-muted',
                  ]"
                >
                  {{ event.status === 'published' ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <router-link
                    :to="`/admin/events/${event.id}/edit`"
                    class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="event.status === 'draft'"
                    type="button"
                    class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="handlePublish(event.id)"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    class="text-sm font-bold text-text-default underline hover:text-brand-donate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    @click="handleDelete(event.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
