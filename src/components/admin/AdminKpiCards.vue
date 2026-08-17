<script setup lang="ts">
import type { AdminKpiCard } from '@/types/admin'

interface Props {
  readonly cards: readonly AdminKpiCard[]
}

defineProps<Props>()
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-kpi-heading">
    <h2 id="admin-kpi-heading" class="sr-only">Key performance indicators</h2>
    <div class="mx-auto grid max-w-container grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.id"
        class="flex flex-col gap-2 rounded-md border border-border-default bg-surface p-5"
      >
        <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">
          {{ card.label }}
        </p>
        <p class="text-3xl font-bold text-text-default">{{ card.value }}</p>
        <p class="text-xs text-text-muted">{{ card.caption }}</p>
      </div>
    </div>
  </section>
</template>
