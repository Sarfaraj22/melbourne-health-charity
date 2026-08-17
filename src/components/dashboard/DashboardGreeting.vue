<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardContent } from '@/composables/useDashboardContent'

const authStore = useAuthStore()
const { content } = useDashboardContent()

const firstName = computed<string>(() => {
  const displayName = authStore.user?.displayName
  if (displayName === undefined || displayName.length === 0) {
    return 'there'
  }
  return displayName.split(' ')[0] ?? displayName
})
</script>

<template>
  <section class="bg-surface px-5 pb-2 pt-12 sm:px-8" aria-labelledby="dashboard-greeting">
    <div class="mx-auto flex max-w-container flex-col gap-2">
      <h1 id="dashboard-greeting" class="text-3xl font-bold text-text-default">
        Hello, {{ firstName }}
      </h1>
      <p class="text-base text-text-muted">{{ content.greetingSubtitle }}</p>
    </div>
  </section>
</template>
