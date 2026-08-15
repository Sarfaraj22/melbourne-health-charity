<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import { useDonateContent } from '@/composables/useDonateContent'

const crumbs: readonly BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Donate', to: '/donate' },
  { label: 'Donation FAQs' },
]
const { faqsIntro, faqs } = useDonateContent()
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero heading="Donation FAQs" :intro="faqsIntro" />
    <section aria-labelledby="donate-faqs-heading" class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-6">
        <h2 id="donate-faqs-heading" class="sr-only">Frequently asked questions</h2>
        <ul class="flex flex-col gap-3">
          <li
            v-for="faq in faqs"
            :key="faq.id"
            class="rounded-lg border border-border-default bg-surface"
          >
            <details>
              <summary
                class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {{ faq.question }}
                <span aria-hidden="true" class="text-xl font-bold text-brand-primary">+</span>
              </summary>
              <p class="px-5 pb-5 text-sm text-text-muted">{{ faq.answer }}</p>
            </details>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
