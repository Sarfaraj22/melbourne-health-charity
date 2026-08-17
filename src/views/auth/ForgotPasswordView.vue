<script setup lang="ts">
import AppLogo from '@/components/ui/AppLogo.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
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
          <h1 class="text-2xl font-bold text-text-default sm:text-3xl">Reset your password</h1>
          <p class="text-sm text-text-muted">
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>
      </div>

      <ForgotPasswordForm />

      <p class="text-center text-sm text-text-muted">
        Remembered your password?
        <router-link
          to="/login"
          class="font-medium text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Back to sign in
        </router-link>
      </p>
    </div>
  </section>
</template>
