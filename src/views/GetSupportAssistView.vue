<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useGetSupportContent } from '@/composables/useGetSupportContent'
import { useAssistanceForm } from '@/composables/useAssistanceForm'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Get Support', to: '/get-support' },
  { label: 'Request Assistance' },
]
const { assistIntro } = useGetSupportContent()
const {
  form,
  errors,
  status,
  errorMessage,
  setName,
  setEmail,
  setPhone,
  setNeed,
  setMessage,
  submit,
  reset,
} = useAssistanceForm()

const nameErrorId = 'assist-name-error'
const emailErrorId = 'assist-email-error'
const needErrorId = 'assist-need-error'
const messageErrorId = 'assist-message-error'
const successMessageId = 'assist-success-message'

const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)
const needDescribedBy = computed((): string | undefined =>
  errors.value.need ? needErrorId : undefined,
)
const messageDescribedBy = computed((): string | undefined =>
  errors.value.message ? messageErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  await submit()
}

function handleInput(setter: (value: string) => void, event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    setter(target.value)
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Request Assistance" :intro="assistIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto max-w-xl">
        <p
          v-if="status === 'success'"
          :id="successMessageId"
          role="status"
          class="rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
        >
          Thank you. We have received your request and will reply within two business days.
        </p>
        <form v-else class="flex flex-col gap-4" novalidate @submit="handleSubmit">
          <p v-if="status === 'error'" class="text-xs text-brand-accent" role="alert">
            {{ errorMessage }}
          </p>
          <div class="flex flex-col gap-1.5">
            <label for="assist-name" class="text-xs font-medium text-text-subtle">Name</label>
            <input
              id="assist-name"
              type="text"
              autocomplete="name"
              required
              :value="form.name"
              :aria-invalid="errors.name ? true : undefined"
              :aria-describedby="nameDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleInput(setName, $event)"
            />
            <p v-if="errors.name" :id="nameErrorId" class="text-xs text-brand-accent" role="alert">
              {{ errors.name }}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="assist-email" class="text-xs font-medium text-text-subtle">Email</label>
            <input
              id="assist-email"
              type="email"
              autocomplete="email"
              required
              :value="form.email"
              :aria-invalid="errors.email ? true : undefined"
              :aria-describedby="emailDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleInput(setEmail, $event)"
            />
            <p
              v-if="errors.email"
              :id="emailErrorId"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ errors.email }}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="assist-phone" class="text-xs font-medium text-text-subtle"
              >Phone (optional)</label
            >
            <input
              id="assist-phone"
              type="tel"
              autocomplete="tel"
              :value="form.phone"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleInput(setPhone, $event)"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="assist-need" class="text-xs font-medium text-text-subtle"
              >What do you need?</label
            >
            <input
              id="assist-need"
              type="text"
              required
              :value="form.need"
              :aria-invalid="errors.need ? true : undefined"
              :aria-describedby="needDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleInput(setNeed, $event)"
            />
            <p v-if="errors.need" :id="needErrorId" class="text-xs text-brand-accent" role="alert">
              {{ errors.need }}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="assist-message" class="text-xs font-medium text-text-subtle">Message</label>
            <textarea
              id="assist-message"
              rows="4"
              required
              :value="form.message"
              :aria-invalid="errors.message ? true : undefined"
              :aria-describedby="messageDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleInput(setMessage, $event)"
            />
            <p
              v-if="errors.message"
              :id="messageErrorId"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ errors.message }}
            </p>
          </div>
          <AppButton type="submit" variant="primary" :disabled="status === 'submitting'">
            Send request
          </AppButton>
        </form>
        <AppButton v-if="status === 'success'" variant="secondary" class="mt-4" @click="reset">
          Send another request
        </AppButton>
      </div>
    </section>
  </div>
</template>
