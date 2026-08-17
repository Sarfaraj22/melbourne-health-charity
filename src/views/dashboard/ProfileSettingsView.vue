<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useAccessibilityStore } from '@/stores/accessibility.store'
import { useAuthStore } from '@/stores/auth.store'

const accessibilityStore = useAccessibilityStore()
const authStore = useAuthStore()
const router = useRouter()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Profile & Settings' },
]

async function handleLogout(): Promise<void> {
  await authStore.signOut()
  void router.push('/login')
}
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Profile & Settings">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col rounded-md border border-border-default bg-surface px-6 pt-6">
        <h2 class="pb-4 text-lg font-bold text-text-default">Accessibility Settings</h2>
        <ul class="flex flex-col divide-y divide-border-default">
          <li class="flex items-center justify-between gap-4 py-4">
            <span class="text-sm font-medium text-text-default">Text Size</span>
            <div class="flex items-center gap-3">
              <span class="text-sm text-text-muted">{{ accessibilityStore.textScale }}</span>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="rounded border border-border-default px-3 py-1.5 text-sm font-medium text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  @click="accessibilityStore.decreaseTextScale"
                >
                  A-
                </button>
                <button
                  type="button"
                  class="rounded border border-border-default px-3 py-1.5 text-sm font-medium text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  @click="accessibilityStore.increaseTextScale"
                >
                  A+
                </button>
              </div>
            </div>
          </li>
          <li class="flex items-center justify-between gap-4 py-4">
            <span class="text-sm font-medium text-text-default">High Contrast</span>
            <button
              type="button"
              class="rounded border border-border-default px-3 py-1.5 text-sm font-medium text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              :aria-pressed="accessibilityStore.highContrast"
              @click="accessibilityStore.toggleHighContrast"
            >
              {{ accessibilityStore.highContrast ? 'On' : 'Off' }}
            </button>
          </li>
        </ul>
      </div>

      <div class="flex flex-col rounded-md border border-border-default bg-surface px-6 pt-6">
        <h2 class="pb-4 text-lg font-bold text-text-default">Account</h2>
        <ul class="flex flex-col divide-y divide-border-default">
          <li class="flex items-center justify-between gap-4 py-4">
            <span class="text-sm font-medium text-text-default">Privacy &amp; Security</span>
            <span class="text-sm text-text-muted">Coming soon</span>
          </li>
          <li class="flex items-center justify-between gap-4 py-4">
            <span class="text-sm font-medium text-text-default">Language</span>
            <span class="text-sm text-text-muted">English</span>
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
  </DashboardLayout>
</template>
