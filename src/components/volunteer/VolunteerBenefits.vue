<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { benefits } = useVolunteerContent()
</script>

<template>
  <section aria-labelledby="volunteer-benefits-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="volunteer-benefits-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Why volunteer with us
      </h2>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="benefit in benefits" :key="benefit.id">
          <BaseCard class="h-full">
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
            >
              <AppIcon :svg="benefit.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
            </span>
            <h3 class="text-base font-bold text-text-default">{{ benefit.title }}</h3>
            <p class="text-sm text-text-muted">{{ benefit.description }}</p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
