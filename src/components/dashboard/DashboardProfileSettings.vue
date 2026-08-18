<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDashboardContent } from '@/composables/useDashboardContent'
import { useAuthStore } from '@/stores/auth.store'

const { content } = useDashboardContent()
const rows = content.settingsRows
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  await authStore.signOut()
  void router.push('/login')
}
</script>

<template>
  <section class="bg-surface px-5 py-6 sm:px-8" aria-labelledby="dashboard-settings-heading">
    <div class="mx-auto max-w-container">
      <div class="flex flex-col rounded-md border border-border-default bg-surface px-6 pt-6">
        <h2 id="dashboard-settings-heading" class="pb-4 text-lg font-bold text-text-default">
          Profile &amp; Settings
        </h2>

        <ul class="flex flex-col divide-y divide-border-default">
          <li class="flex items-center justify-between py-3.5">
            <span class="text-sm font-medium text-text-default">Name</span>
            <span class="text-sm text-text-muted">{{ authStore.user?.displayName || '—' }}</span>
          </li>
          <li class="flex items-center justify-between py-3.5">
            <span class="text-sm font-medium text-text-default">Email</span>
            <span class="text-sm text-text-muted">{{ authStore.user?.email || '—' }}</span>
          </li>
          <li v-for="row in rows" :key="row.id" class="flex items-center justify-between py-3.5">
            <span class="text-sm font-medium text-text-default">{{ row.label }}</span>
            <router-link
              v-if="row.to"
              :to="row.to"
              class="text-sm text-text-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {{ row.value }} <span aria-hidden="true">&rsaquo;</span>
            </router-link>
          </li>
          <li class="flex items-center py-4">
            <button
              type="button"
              class="text-sm font-bold text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @click="handleLogout"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
