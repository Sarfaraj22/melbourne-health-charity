<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'
import lockIcon from '@/assets/icons/lock.svg?raw'

const { dashboard } = useVolunteerContent()
const { messages, coordinator } = dashboard
</script>

<template>
  <section aria-labelledby="volunteer-messages-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-messages-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Messages
      </h2>

      <div class="grid gap-6 lg:grid-cols-3">
        <ul class="flex flex-col gap-3 lg:col-span-2">
          <li
            v-for="message in messages"
            :key="message.id"
            class="flex flex-col gap-1 rounded-lg border border-border-default bg-surface p-4"
          >
            <span class="text-sm font-bold text-text-default">{{ message.sender }}</span>
            <span class="text-sm text-text-muted">{{ message.preview }}</span>
          </li>
        </ul>

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
            <p class="text-xs text-text-subtle">Messages are private and encrypted</p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
