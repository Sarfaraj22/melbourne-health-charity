<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useContactContent } from '@/composables/useContactContent'

const { methods } = useContactContent()
</script>

<template>
  <section aria-labelledby="contact-methods-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col items-center gap-8">
      <div class="flex max-w-2xl flex-col items-center gap-2 text-center">
        <h2 id="contact-methods-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Other ways to reach us
        </h2>
        <p class="text-base text-text-muted">
          Choose the option that works best for you. Live chat is available during office hours.
        </p>
      </div>
      <ul class="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        <li v-for="method in methods" :key="method.id">
          <a
            v-if="method.href"
            :href="method.href"
            class="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <BaseCard interactive class="h-full items-center text-center">
              <span
                class="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
              >
                <AppIcon :svg="method.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
              </span>
              <h3 class="text-base font-bold text-text-default">{{ method.title }}</h3>
              <p class="text-sm text-text-subtle">{{ method.description }}</p>
              <p class="text-sm font-bold text-brand-primary">{{ method.ctaLabel }}</p>
            </BaseCard>
          </a>
          <BaseCard v-else class="h-full items-center text-center">
            <span
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
            >
              <AppIcon :svg="method.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
            </span>
            <h3 class="text-base font-bold text-text-default">{{ method.title }}</h3>
            <p class="text-sm text-text-subtle">{{ method.description }}</p>
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              class="w-full"
              disabled
              :aria-describedby="`${method.id}-unavailable`"
            >
              {{ method.ctaLabel }}
            </AppButton>
            <p :id="`${method.id}-unavailable`" class="text-xs text-text-subtle">
              Live chat is not available right now. Please use the form, phone, or email.
            </p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
