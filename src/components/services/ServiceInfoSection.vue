<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceDetail } from '@/types/service'

interface Props {
  readonly service: ServiceDetail
  readonly heading?: string
}

const props = defineProps<Props>()

const headingText = computed((): string => props.heading ?? 'Service Information')

interface InfoRow {
  readonly label: string
  readonly value: string
}

function buildRows(service: ServiceDetail): readonly InfoRow[] {
  return [
    { label: 'Description', value: service.description },
    { label: 'Eligibility', value: service.eligibility },
    { label: 'Location', value: service.location },
    { label: 'Cost', value: service.cost },
    { label: 'Availability', value: service.availability },
  ]
}
</script>

<template>
  <section aria-labelledby="service-info-heading" class="flex flex-col gap-5">
    <h2 id="service-info-heading" class="text-2xl font-bold text-text-default">
      {{ headingText }}
    </h2>
    <dl class="flex flex-col">
      <div
        v-for="(row, index) in buildRows(service)"
        :key="row.label"
        :class="[
          'flex flex-col gap-1.5 py-4',
          index < buildRows(service).length - 1 ? 'border-b border-border-default' : '',
        ]"
      >
        <dt class="text-xs font-medium uppercase tracking-wide text-text-subtle">
          {{ row.label }}
        </dt>
        <dd class="text-base text-text-default">{{ row.value }}</dd>
      </div>
    </dl>
  </section>
</template>
