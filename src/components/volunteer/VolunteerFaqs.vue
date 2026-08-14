<script setup lang="ts">
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { faqsIntro, faqs } = useVolunteerContent()
</script>

<template>
  <section aria-labelledby="volunteer-faqs-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex max-w-2xl flex-col gap-2">
        <h2 id="volunteer-faqs-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Frequently asked questions
        </h2>
        <p class="text-base text-text-muted">{{ faqsIntro }}</p>
      </div>
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
</template>
