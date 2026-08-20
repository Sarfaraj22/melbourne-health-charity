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

const expectedRole = computed<Role | undefined>(() => route.meta.expectedRole)

const loginFormBind = computed<Readonly<{ expectedRole: Role }> | Readonly<Record<string, never>>>(
  () => {
    const role = expectedRole.value
    if (role === undefined) {
      return {}
    }
    return { expectedRole: role }
  },
)

const heading = computed<string>(() => {
  if (expectedRole.value === 'volunteer') {
    return 'Volunteer login'
  }
  if (expectedRole.value === 'admin') {
    return 'Admin login'
  }
  return 'Welcome back'
})

const subtitle = computed<string>(() => {
  if (expectedRole.value === 'volunteer') {
    return 'Sign in to access the volunteer portal.'
  }
  if (expectedRole.value === 'admin') {
    return 'Sign in to access the admin dashboard.'
  }
  return 'Sign in to access your account.'
})

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
  return required.includes(currentRole)
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
          <h1 class="text-2xl font-bold text-text-default sm:text-3xl">{{ heading }}</h1>
          <p class="text-sm text-text-muted">{{ subtitle }}</p>
        </div>
      </div>

      <LoginForm v-bind="loginFormBind" @success="handleSuccess" />

      <div class="flex flex-col gap-2 text-center text-sm text-text-muted">
        <router-link
          to="/forgot-password"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Forgot your password?
        </router-link>
        <p v-if="expectedRole === 'volunteer'">
          Want to volunteer?
          <router-link
            to="/volunteer/become-a-volunteer"
            class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Become a volunteer
          </router-link>
        </p>
        <p v-else-if="expectedRole === undefined">
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
