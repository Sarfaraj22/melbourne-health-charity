<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@/types/service'
import type { DonationFormState, DonationFrequency } from '@/types/donate'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useDonateContent } from '@/composables/useDonateContent'
import { useDonationForm } from '@/composables/useDonationForm'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Donate', to: '/donate' },
  { label: 'Make a Donation' },
]
const { donateIntro } = useDonateContent()
const {
  form,
  errors,
  status,
  errorMessage,
  setAmountPreset,
  setCustomAmount,
  setFrequency,
  setName,
  setEmail,
  setMessage,
  submit,
  reset,
} = useDonationForm()

type AmountPreset = DonationFormState['amountPreset']

const amountPresets: readonly { readonly value: AmountPreset; readonly label: string }[] = [
  { value: '25', label: '$25' },
  { value: '50', label: '$50' },
  { value: '100', label: '$100' },
  { value: 'custom', label: 'Custom' },
]

const frequencies: readonly { readonly value: DonationFrequency; readonly label: string }[] = [
  { value: 'one-off', label: 'One-off' },
  { value: 'monthly', label: 'Monthly' },
]

const amountErrorId = 'donate-amount-error'
const nameErrorId = 'donate-name-error'
const emailErrorId = 'donate-email-error'
const successMessageId = 'donate-success-message'

const amountDescribedBy = computed((): string | undefined =>
  errors.value.amount ? amountErrorId : undefined,
)
const nameDescribedBy = computed((): string | undefined =>
  errors.value.name ? nameErrorId : undefined,
)
const emailDescribedBy = computed((): string | undefined =>
  errors.value.email ? emailErrorId : undefined,
)

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault()
  await submit()
}

function handleCustomAmountInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setCustomAmount(target.value)
  }
}

function handleNameInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setName(target.value)
  }
}

function handleEmailInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    setEmail(target.value)
  }
}

function handleMessageInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLTextAreaElement) {
    setMessage(target.value)
  }
}
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Make a Donation" :intro="donateIntro" />
    <section class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto max-w-xl">
        <p
          v-if="status === 'success'"
          :id="successMessageId"
          role="status"
          class="rounded border border-brand-accent bg-surface-muted p-4 text-sm text-text-default"
        >
          Thank you. We have received your donation request and will contact you to complete the
          gift securely. This page does not take card payments.
        </p>
        <form v-else class="flex flex-col gap-4" novalidate @submit="handleSubmit">
          <p v-if="status === 'error'" class="text-xs text-brand-accent" role="alert">
            {{ errorMessage }}
          </p>
          <fieldset class="flex flex-col gap-1.5">
            <legend class="text-xs font-medium text-text-subtle">Amount</legend>
            <div
              class="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Donation amount"
              :aria-describedby="amountDescribedBy"
            >
              <button
                v-for="preset in amountPresets"
                :key="preset.value"
                type="button"
                role="radio"
                :aria-checked="form.amountPreset === preset.value"
                :class="[
                  'rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                  form.amountPreset === preset.value
                    ? 'bg-text-default text-text-on-brand'
                    : 'border border-border-default bg-surface text-text-default',
                ]"
                @click="setAmountPreset(preset.value)"
              >
                {{ preset.label }}
              </button>
            </div>
            <div v-if="form.amountPreset === 'custom'" class="flex flex-col gap-1.5">
              <label for="donate-custom-amount" class="text-xs font-medium text-text-subtle">
                Custom amount (AUD)
              </label>
              <input
                id="donate-custom-amount"
                type="number"
                min="2"
                step="1"
                inputmode="decimal"
                required
                :value="form.customAmount"
                :aria-invalid="errors.amount ? true : undefined"
                :aria-describedby="amountDescribedBy"
                class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                @input="handleCustomAmountInput"
              />
            </div>
            <p
              v-if="errors.amount"
              :id="amountErrorId"
              class="text-xs text-brand-accent"
              role="alert"
            >
              {{ errors.amount }}
            </p>
          </fieldset>

          <fieldset class="flex flex-col gap-1.5">
            <legend class="text-xs font-medium text-text-subtle">Frequency</legend>
            <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Donation frequency">
              <button
                v-for="option in frequencies"
                :key="option.value"
                type="button"
                role="radio"
                :aria-checked="form.frequency === option.value"
                :class="[
                  'rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                  form.frequency === option.value
                    ? 'bg-text-default text-text-on-brand'
                    : 'border border-border-default bg-surface text-text-default',
                ]"
                @click="setFrequency(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </fieldset>

          <div class="flex flex-col gap-1.5">
            <label for="donate-name" class="text-xs font-medium text-text-subtle">Name</label>
            <input
              id="donate-name"
              type="text"
              autocomplete="name"
              required
              :value="form.name"
              :aria-invalid="errors.name ? true : undefined"
              :aria-describedby="nameDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleNameInput"
            />
            <p v-if="errors.name" :id="nameErrorId" class="text-xs text-brand-accent" role="alert">
              {{ errors.name }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="donate-email" class="text-xs font-medium text-text-subtle">Email</label>
            <input
              id="donate-email"
              type="email"
              autocomplete="email"
              required
              :value="form.email"
              :aria-invalid="errors.email ? true : undefined"
              :aria-describedby="emailDescribedBy"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleEmailInput"
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
            <label for="donate-message" class="text-xs font-medium text-text-subtle">
              Message (optional)
            </label>
            <textarea
              id="donate-message"
              rows="4"
              :value="form.message"
              class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              @input="handleMessageInput"
            />
          </div>

          <p class="text-xs text-text-subtle">
            This form records your request only. We will contact you to complete the donation
            securely.
          </p>
          <AppButton type="submit" variant="primary" :disabled="status === 'submitting'">
            Submit donation request
          </AppButton>
        </form>
        <AppButton v-if="status === 'success'" variant="secondary" class="mt-4" @click="reset">
          Make another request
        </AppButton>
      </div>
    </section>
  </div>
</template>
