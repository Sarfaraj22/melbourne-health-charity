<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { ServiceDetail } from '@/types/service'

import infoIcon from '@/assets/icons/info.svg?raw'
import userCheckIcon from '@/assets/icons/user-check.svg?raw'
import mapPinIcon from '@/assets/icons/map-pin.svg?raw'
import banknoteIcon from '@/assets/icons/banknote.svg?raw'
import calendarDaysIcon from '@/assets/icons/calendar-days.svg?raw'

interface Props {
  readonly service: ServiceDetail
}

const props = defineProps<Props>()

interface InfoTile {
  readonly label: string
  readonly value: string
  readonly icon: string
}

const tiles: ComputedRef<readonly InfoTile[]> = computed(() => [
  { label: 'Eligibility', value: props.service.eligibility, icon: userCheckIcon },
  { label: 'Location', value: props.service.location, icon: mapPinIcon },
  { label: 'Cost', value: props.service.cost, icon: banknoteIcon },
  { label: 'Availability', value: props.service.availability, icon: calendarDaysIcon },
])
</script>

<template>
  <section aria-labelledby="service-info-heading" class="flex flex-col gap-8">
    <h1 id="service-info-heading" class="text-3xl font-bold text-text-default sm:text-4xl">
      {{ service.title }}
    </h1>

    <div class="flex items-start gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
      >
        <AppIcon :svg="infoIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
      </span>
      <p class="text-base text-text-muted">{{ service.description }}</p>
    </div>

    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <li v-for="tile in tiles" :key="tile.label">
        <BaseCard class="h-full">
          <div class="flex items-start gap-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
            >
              <AppIcon :svg="tile.icon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
            </span>
            <div class="flex flex-col gap-1">
              <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">
                {{ tile.label }}
              </p>
              <p class="text-sm text-text-default">{{ tile.value }}</p>
            </div>
          </div>
        </BaseCard>
      </li>
    </ul>
  </section>
</template>
