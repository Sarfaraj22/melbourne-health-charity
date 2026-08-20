<script setup lang="ts">
import type { AdminAuditLog } from '@/types/admin'
import { formatMillisAsDdMmYyyy } from '@/utils/datetime'

interface Props {
  readonly auditLogs: readonly AdminAuditLog[]
}

defineProps<Props>()
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-audit-heading">
    <div class="mx-auto flex max-w-container flex-col gap-3">
      <h2 id="admin-audit-heading" class="text-lg font-bold text-text-default">Audit trail</h2>
      <p v-if="auditLogs.length === 0" class="text-sm text-text-muted">
        No audit events yet. Changes to volunteers, events, hours, reports, emails, and password
        resets appear here.
      </p>
      <ul
        v-else
        class="flex flex-col divide-y divide-border-default overflow-x-auto rounded-md border border-border-default bg-surface"
      >
        <li v-for="entry in auditLogs" :key="entry.id" class="flex flex-col gap-1 px-4 py-3">
          <p class="text-sm font-bold text-text-default">{{ entry.summary }}</p>
          <p class="text-xs text-text-subtle">
            {{ entry.actorEmail.length > 0 ? entry.actorEmail : 'Unknown email' }} ·
            {{ entry.action }} · {{ entry.collection }} ·
            {{ formatMillisAsDdMmYyyy(entry.createdAt) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
