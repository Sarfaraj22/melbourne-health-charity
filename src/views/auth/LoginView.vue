<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLogo from '@/components/ui/AppLogo.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth.store'
import type { Role } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const redirectTarget = computed<string | undefined>(() => {
  const value = route.query['redirect']
  return typeof value === 'string' && value.length > 0 ? value : undefined
})

function roleSatisfiesTarget(targetPath: string): boolean {
  const resolved = router.resolve(targetPath)
  const required = resolved.meta.requiresRole
  const currentRole = authStore.role
  if (required === undefined || currentRole === undefined) {
    return true
  }
  return required.includes(currentRole as Role)
}

function handleSuccess(): void {
  const target = redirectTarget.value
  if (target !== undefined && roleSatisfiesTarget(target)) {
    void router.push(target)
    return
  }
  void router.push(authStore.roleHome())
}
</script>

<template>
  <section
    class="mx-auto flex min-h-placeholder max-w-container flex-col items-center justify-center gap-6 px-5 py-16 sm:px-8"
  >
    <div
      class="flex w-full max-w-md flex-col gap-6 rounded-lg border border-border-default bg-surface p-6 shadow-card sm:p-8"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <AppLogo size="md" />
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-text-default sm:text-3xl">Welcome back</h1>
          <p class="text-sm text-text-muted">Sign in to access your account.</p>
        </div>
      </div>

      <LoginForm @success="handleSuccess" />

      <div class="flex flex-col gap-2 text-center text-sm text-text-muted">
        <router-link
          to="/forgot-password"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Forgot your password?
        </router-link>
        <p>
          New to Melbourne Health Charity?
          <router-link
            to="/register"
            class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Create an account
          </router-link>
        </p>
      </div>
    </div>
  </section>
</template>
