<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import MessageThreadPanel from '@/components/messaging/MessageThreadPanel.vue'
import { useMessageThreads } from '@/composables/useMessageThreads'
import { useVolunteerContent } from '@/composables/useVolunteerContent'
import { useVolunteerPortalData } from '@/composables/useVolunteerPortalData'
import lockIcon from '@/assets/icons/lock.svg?raw'

const { dashboard } = useVolunteerContent()
const { coordinator } = dashboard
const { coordinatorUid } = useVolunteerPortalData()
const {
  threads,
  selectedId,
  messages,
  draft,
  sending,
  sendError,
  composeError,
  listError,
  selfUid,
  selectThread,
  sendReply,
  startThreadWith,
} = useMessageThreads('self')

async function chatWithCoordinator(): Promise<void> {
  if (coordinatorUid.value.length === 0) {
    return
  }
  const existing = threads.value.find((thread) => thread.counterpartUid === coordinatorUid.value)
  if (existing !== undefined) {
    selectThread(existing.id)
    return
  }
  await startThreadWith(coordinatorUid.value)
}
</script>

<template>
  <section aria-labelledby="volunteer-messages-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-messages-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Messages
      </h2>

      <div class="grid gap-6 lg:grid-cols-3">
        <aside
          aria-label="Your coordinator"
          class="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-muted p-5 lg:order-first"
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
          <p v-if="listError" class="text-sm text-brand-donate" role="alert">{{ listError }}</p>
          <p v-if="composeError" class="text-sm text-brand-donate" role="alert">
            {{ composeError }}
          </p>
          <p v-if="coordinatorUid.length === 0" class="text-sm text-text-muted">
            A coordinator is not assigned yet. You will be able to chat here once one is assigned.
          </p>
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            :disabled="coordinatorUid.length === 0"
            @click="chatWithCoordinator"
          >
            Chat with your coordinator
          </AppButton>
        </aside>

        <div class="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <MessageThreadPanel
            :threads="threads"
            :selected-id="selectedId"
            :messages="messages"
            :self-uid="selfUid"
            :draft="draft"
            :sending="sending"
            :send-error="sendError"
            empty-list-message="No conversations yet. Chat with your coordinator to start one."
            :can-reply="true"
            :can-collapse="true"
            @select="selectThread"
            @update:draft="draft = $event"
            @send="sendReply"
            @close="selectThread('')"
          />
        </div>
      </div>
    </div>
  </section>
</template>
