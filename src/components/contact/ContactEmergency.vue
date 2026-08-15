<script setup lang="ts">
import type { ContactEmergencyKind } from '@/types/contact'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useContactContent } from '@/composables/useContactContent'
import lifeBuoyIcon from '@/assets/icons/life-buoy.svg?raw'
import phoneIcon from '@/assets/icons/phone.svg?raw'

const { emergencyContacts } = useContactContent()

function iconForKind(kind: ContactEmergencyKind): string {
  return kind === 'crisis' ? lifeBuoyIcon : phoneIcon
}
</script>

<template>
  <section aria-labelledby="contact-emergency-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-8">
      <div class="flex max-w-2xl flex-col gap-2">
        <h2 id="contact-emergency-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Emergency contacts
        </h2>
        <p class="text-base text-text-muted">
          If you or someone you support is in immediate danger, call 000. For crisis support or to
          reach a support worker, use the numbers below.
        </p>
      </div>
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <li v-for="contact in emergencyContacts" :key="contact.id">
          <article
            :class="[
              'flex h-full flex-col gap-3 rounded-lg border bg-surface p-6 shadow-card',
              contact.kind === 'crisis' ? 'border-brand-accent' : 'border-border-default',
            ]"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
            >
              <AppIcon :svg="iconForKind(contact.kind)" class-name="[&>svg]:h-6 [&>svg]:w-6" />
            </span>
            <div class="flex flex-col gap-1">
              <p
                v-if="contact.kind === 'crisis'"
                class="text-xs font-medium uppercase tracking-wide text-brand-accent"
              >
                24/7 crisis line
              </p>
              <p v-else class="text-xs font-medium uppercase tracking-wide text-text-subtle">
                Business hours
              </p>
              <h3 class="text-lg font-bold text-text-default">{{ contact.label }}</h3>
              <a
                :href="contact.phoneHref"
                class="text-base font-bold text-brand-primary hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {{ contact.phone }}
              </a>
              <p class="text-sm text-text-muted">{{ contact.hours }}</p>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
