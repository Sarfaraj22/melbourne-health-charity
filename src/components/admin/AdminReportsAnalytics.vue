<script setup lang="ts">
import { computed } from 'vue'
import type { AdminChartBar, AdminReportMetric } from '@/types/admin'

interface Props {
  readonly chartBars: readonly AdminChartBar[]
  readonly metrics: readonly AdminReportMetric[]
}

const props = defineProps<Props>()

const maxHours = computed<number>(() => {
  const max = props.chartBars.reduce((highest, bar) => Math.max(highest, bar.hours), 0)
  return max > 0 ? max : 1
})
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="admin-reports-heading">
    <div class="mx-auto flex max-w-container flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <h2 id="admin-reports-heading" class="text-2xl font-bold text-text-default">
          Reports &amp; Analytics
        </h2>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded bg-brand-primary px-4 py-2 text-sm font-bold text-text-on-brand hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Generate Report
        </button>
      </div>

      <div
        class="flex flex-col gap-8 rounded-md border border-border-default p-6 lg:flex-row lg:gap-10"
      >
        <div class="flex flex-col gap-3 lg:w-2/3">
          <p class="text-sm font-medium text-text-muted">Volunteer Hours Logged (by month)</p>
          <div class="flex h-40 items-end gap-4">
            <div
              v-for="bar in chartBars"
              :key="bar.id"
              class="flex flex-1 flex-col items-center gap-2"
            >
              <div
                class="w-7 rounded-sm bg-brand-primary"
                :style="{ height: `${(bar.hours / maxHours) * 100}%` }"
              />
              <p class="text-xs text-text-subtle">{{ bar.label }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5 lg:w-1/3">
          <div v-for="metric in metrics" :key="metric.id" class="flex flex-col gap-1">
            <p class="text-2xl font-bold text-text-default">{{ metric.value }}</p>
            <p class="text-xs text-text-muted">{{ metric.caption }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
