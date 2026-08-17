<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import usersIcon from '@/assets/icons/users.svg?raw'
import lockIcon from '@/assets/icons/lock.svg?raw'
import clipboardListIcon from '@/assets/icons/clipboard-list.svg?raw'
import shieldCheckIcon from '@/assets/icons/shield-check.svg?raw'
import type { AdminComplianceFeature } from '@/types/admin'

interface Props {
  readonly features: readonly AdminComplianceFeature[]
}

defineProps<Props>()

const iconMap: ReadonlyMap<string, string> = new Map<string, string>([
  ['users', usersIcon],
  ['lock', lockIcon],
  ['clipboard-list', clipboardListIcon],
  ['shield-check', shieldCheckIcon],
])
</script>

<template>
  <section class="bg-surface-muted px-5 py-14 sm:px-8" aria-labelledby="admin-security-heading">
    <div class="mx-auto flex max-w-container flex-col items-center gap-3">
      <h2 id="admin-security-heading" class="text-2xl font-bold text-text-default">
        Data Security &amp; Compliance
      </h2>
      <p class="text-sm text-text-muted">
        Built to keep volunteer and participant data safe, private, and compliant.
      </p>
      <div class="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="flex flex-col items-center gap-3 rounded-md border border-border-default bg-surface px-5 py-6 text-center"
        >
          <div class="flex h-10 w-10 items-center justify-center">
            <AppIcon
              :svg="iconMap.get(feature.icon) ?? ''"
              class-name="text-brand-primary [&>svg]:h-10 [&>svg]:w-10"
            />
          </div>
          <h3 class="text-base font-bold text-text-default">{{ feature.title }}</h3>
          <p class="text-sm text-text-muted">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
