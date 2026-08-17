<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLogo from '@/components/ui/AppLogo.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

function handleSuccess(): void {
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
          <h1 class="text-2xl font-bold text-text-default sm:text-3xl">Create your account</h1>
          <p class="text-sm text-text-muted">
            Join Melbourne Health Charity to access services and support.
          </p>
        </div>
      </div>

      <RegisterForm @success="handleSuccess" />

      <p class="text-center text-sm text-text-muted">
        Already have an account?
        <router-link
          to="/login"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Sign in
        </router-link>
      </p>
    </div>
  </section>
</template>
