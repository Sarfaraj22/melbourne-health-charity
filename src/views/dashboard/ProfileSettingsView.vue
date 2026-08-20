<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import FormFieldLabel from '@/components/ui/FormFieldLabel.vue'
import { useAccessibilityStore } from '@/stores/accessibility.store'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileSecurity } from '@/composables/useProfileSecurity'

const accessibilityStore = useAccessibilityStore()
const authStore = useAuthStore()
const router = useRouter()
const {
  emailValue,
  emailPassword,
  emailErrors,
  emailStatus,
  emailMessage,
  emailEditing,
  currentPassword,
  newPassword,
  confirmPassword,
  passwordErrors,
  passwordStatus,
  passwordMessage,
  startEmailEdit,
  cancelEmailEdit,
  setEmailValue,
  setEmailPassword,
  submitEmail,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  submitPassword,
} = useProfileSecurity()

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'My Dashboard', to: '/dashboard' },
  { label: 'Profile & Settings' },
]

const emailInput = ref<HTMLInputElement | null>(null)
const emailPasswordInput = ref<HTMLInputElement | null>(null)
const currentPasswordInput = ref<HTMLInputElement | null>(null)
const newPasswordInput = ref<HTMLInputElement | null>(null)
const confirmPasswordInput = ref<HTMLInputElement | null>(null)

async function handleLogout(): Promise<void> {
  await authStore.signOut()
  void router.push('/login')
}

async function handleEmailSubmit(): Promise<void> {
  const ok = await submitEmail()
  if (ok) {
    return
  }
  await nextTick()
  if (emailErrors.value.email !== undefined) {
    emailInput.value?.focus()
    return
  }
  emailPasswordInput.value?.focus()
}

async function handlePasswordSubmit(): Promise<void> {
  const ok = await submitPassword()
  if (ok) {
    return
  }
  await nextTick()
  if (passwordErrors.value.currentPassword !== undefined) {
    currentPasswordInput.value?.focus()
    return
  }
  if (passwordErrors.value.newPassword !== undefined) {
    newPasswordInput.value?.focus()
    return
  }
  confirmPasswordInput.value?.focus()
}
</script>

<template>
  <DashboardLayout :crumbs="crumbs" heading="Profile & Settings">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col rounded-md border border-border-default bg-surface px-6 pt-6">
        <h2 class="pb-4 text-lg font-bold text-text-default">Account</h2>
        <ul class="flex flex-col divide-y divide-border-default">
          <li class="flex items-center justify-between gap-4 py-4">
            <span class="text-sm font-medium text-text-default">Name</span>
            <span class="text-sm text-text-muted">{{ authStore.user?.displayName || '—' }}</span>
          </li>
          <li class="flex flex-col gap-3 py-4">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-medium text-text-default">Email</span>
              <div class="flex items-center gap-3">
                <span class="text-sm text-text-muted">{{ authStore.user?.email || '—' }}</span>
                <AppButton
                  v-if="!emailEditing"
                  type="button"
                  variant="secondary"
                  size="sm"
                  @click="startEmailEdit"
                >
                  Edit
                </AppButton>
              </div>
            </div>
            <form
              v-if="emailEditing"
              class="flex flex-col gap-3"
              novalidate
              @submit.prevent="handleEmailSubmit"
            >
              <div class="flex flex-col gap-1.5">
                <FormFieldLabel html-for="profile-email" :required="true">New email</FormFieldLabel>
                <input
                  id="profile-email"
                  ref="emailInput"
                  type="email"
                  autocomplete="email"
                  required
                  aria-required="true"
                  :value="emailValue"
                  :aria-invalid="emailErrors.email ? true : undefined"
                  :aria-describedby="emailErrors.email ? 'profile-email-error' : undefined"
                  class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  @input="
                    (event) => {
                      const target = event.target
                      if (target instanceof HTMLInputElement) setEmailValue(target.value)
                    }
                  "
                />
                <p
                  v-if="emailErrors.email"
                  id="profile-email-error"
                  class="text-xs text-brand-accent"
                  role="alert"
                >
                  {{ emailErrors.email }}
                </p>
              </div>
              <div class="flex flex-col gap-1.5">
                <FormFieldLabel html-for="profile-email-password" :required="true">
                  Current password
                </FormFieldLabel>
                <input
                  id="profile-email-password"
                  ref="emailPasswordInput"
                  type="password"
                  autocomplete="current-password"
                  required
                  aria-required="true"
                  :value="emailPassword"
                  :aria-invalid="emailErrors.password ? true : undefined"
                  :aria-describedby="
                    emailErrors.password ? 'profile-email-password-error' : undefined
                  "
                  class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  @input="
                    (event) => {
                      const target = event.target
                      if (target instanceof HTMLInputElement) setEmailPassword(target.value)
                    }
                  "
                />
                <p
                  v-if="emailErrors.password"
                  id="profile-email-password-error"
                  class="text-xs text-brand-accent"
                  role="alert"
                >
                  {{ emailErrors.password }}
                </p>
              </div>
              <p v-if="emailStatus === 'error'" class="text-xs text-brand-accent" role="alert">
                {{ emailMessage }}
              </p>
              <div class="flex flex-wrap gap-2">
                <AppButton type="submit" size="sm" :disabled="emailStatus === 'submitting'">
                  {{ emailStatus === 'submitting' ? 'Saving...' : 'Save email' }}
                </AppButton>
                <AppButton type="button" variant="secondary" size="sm" @click="cancelEmailEdit">
                  Cancel
                </AppButton>
              </div>
            </form>
            <p
              v-if="emailStatus === 'success'"
              class="text-sm text-status-success"
              role="status"
              aria-live="polite"
            >
              {{ emailMessage }}
            </p>
          </li>
        </ul>
      </div>

      <div class="flex flex-col rounded-md border border-border-default bg-surface px-6 pt-6">
        <h2 class="pb-4 text-lg font-bold text-text-default">Privacy &amp; Security</h2>
        <form class="flex flex-col gap-4 pb-6" novalidate @submit.prevent="handlePasswordSubmit">
          <div class="flex flex-col gap-1.5">
            <FormFieldLabel html-for="profile-current-password" :required="true">
              Current password
            </FormFieldLabel>
            <input
              id="profile-current-password"
              ref="currentPasswordInput"
              type="password"
              autocomplete="current-password"
              required
              aria-required="true"
              :value="currentPassword"
              :aria-invalid="passwordErrors.currentPassword ? true : undefined"
              :aria-describedby="
                passwordErrors.currentPassword ? 'profile-current-password-error' : undefined
              "
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="
                (event) => {
                  const target = event.target
                  if (target instanceof HTMLInputElement) setCurrentPassword(target.value)
                }
              "
            />
            <p
              v-if="passwordErrors.currentPassword"
              id="profile-current-password-error"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ passwordErrors.currentPassword }}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <FormFieldLabel html-for="profile-new-password" :required="true">
              New password
            </FormFieldLabel>
            <input
              id="profile-new-password"
              ref="newPasswordInput"
              type="password"
              autocomplete="new-password"
              required
              aria-required="true"
              :value="newPassword"
              :aria-invalid="passwordErrors.newPassword ? true : undefined"
              :aria-describedby="
                passwordErrors.newPassword
                  ? 'profile-new-password-error profile-new-password-hint'
                  : 'profile-new-password-hint'
              "
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="
                (event) => {
                  const target = event.target
                  if (target instanceof HTMLInputElement) setNewPassword(target.value)
                }
              "
            />
            <p id="profile-new-password-hint" class="text-xs text-text-subtle">
              Must be at least 8 characters.
            </p>
            <p
              v-if="passwordErrors.newPassword"
              id="profile-new-password-error"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ passwordErrors.newPassword }}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <FormFieldLabel html-for="profile-confirm-password" :required="true">
              Confirm new password
            </FormFieldLabel>
            <input
              id="profile-confirm-password"
              ref="confirmPasswordInput"
              type="password"
              autocomplete="new-password"
              required
              aria-required="true"
              :value="confirmPassword"
              :aria-invalid="passwordErrors.confirmPassword ? true : undefined"
              :aria-describedby="
                passwordErrors.confirmPassword ? 'profile-confirm-password-error' : undefined
              "
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="
                (event) => {
                  const target = event.target
                  if (target instanceof HTMLInputElement) setConfirmPassword(target.value)
                }
              "
            />
            <p
              v-if="passwordErrors.confirmPassword"
              id="profile-confirm-password-error"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>
          <p v-if="passwordStatus === 'error'" class="text-xs text-brand-accent" role="alert">
            {{ passwordMessage }}
          </p>
          <p
            v-if="passwordStatus === 'success'"
            class="text-sm text-status-success"
            role="status"
            aria-live="polite"
          >
            {{ passwordMessage }}
          </p>
          <AppButton type="submit" size="sm" :disabled="passwordStatus === 'submitting'">
            {{ passwordStatus === 'submitting' ? 'Updating...' : 'Change password' }}
          </AppButton>
        </form>
      </div>

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
