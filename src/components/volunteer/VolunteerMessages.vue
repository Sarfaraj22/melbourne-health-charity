<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useInboxReply } from '@/composables/useInboxReply'
import { useVolunteerContent } from '@/composables/useVolunteerContent'
import { useVolunteerPortalData } from '@/composables/useVolunteerPortalData'
import lockIcon from '@/assets/icons/lock.svg?raw'

const { dashboard } = useVolunteerContent()
const { coordinator } = dashboard
const { messages } = useVolunteerPortalData()
const { draft, status, errorMessage, send } = useInboxReply('volunteer')
</script>

<template>
  <section aria-labelledby="volunteer-messages-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-messages-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Messages
      </h2>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-4 lg:col-span-2">
          <p v-if="messages.length === 0" class="text-base text-text-muted">
            You have no messages yet.
          </p>
          <ul v-else class="flex flex-col gap-3">
            <li
              v-for="message in messages"
              :key="message.id"
              class="flex flex-col gap-1 rounded-lg border border-border-default bg-surface p-4"
            >
              <span class="text-sm font-bold text-text-default">{{ message.sender }}</span>
              <span class="text-sm text-text-muted">{{ message.body }}</span>
            </li>
          </ul>

          <form class="flex flex-col gap-2" novalidate @submit.prevent="send">
            <label for="volunteer-message-reply" class="text-sm font-medium text-text-default">
              Reply
            </label>
            <textarea
              id="volunteer-message-reply"
              v-model="draft"
              rows="3"
              class="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-base text-text-default focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
            <p v-if="status === 'error'" class="text-sm text-brand-donate" role="alert">
              {{ errorMessage }}
            </p>
            <p v-if="status === 'success'" class="text-sm text-status-success" role="status">
              Reply sent.
            </p>
            <AppButton type="submit" :disabled="status === 'submitting'">
              {{ status === 'submitting' ? 'Sending...' : 'Send reply' }}
            </AppButton>
          </form>
        </div>

        <aside
          aria-label="Your coordinator"
          class="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-muted p-5"
        >
          <span class="text-xs font-bold tracking-wide text-text-subtle">YOUR COORDINATOR</span>
          <div class="flex items-center gap-3">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-base font-bold text-text-on-brand"
              aria-hidden="true"
            >
              {{ coordinator.initials }}
            </span>
            <div class="flex flex-col">
              <span class="text-base font-bold text-text-default">{{ coordinator.name }}</span>
              <span class="text-sm text-text-muted">{{ coordinator.role }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <AppIcon :svg="lockIcon" class-name="text-text-subtle [&>svg]:size-3" />
            <p class="text-xs text-text-subtle">End-to-end encrypted</p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
