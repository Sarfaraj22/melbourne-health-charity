<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useCommunityContent } from '@/composables/useCommunityContent'

const { socialChannels } = useCommunityContent()
</script>

<template>
  <section
    id="social"
    aria-labelledby="community-social-heading"
    class="bg-surface-muted px-5 py-14 sm:px-8"
  >
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 id="community-social-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
          Social media
        </h2>
        <p class="max-w-2xl text-base text-text-muted">
          Follow us for news, events, and everyday stories from our Melbourne community.
        </p>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="channel in socialChannels" :key="channel.id">
          <BaseCard class="h-full items-center text-center">
            <span
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-brand-primary"
            >
              <AppIcon :svg="channel.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
            </span>
            <h3 class="text-base font-bold text-text-default">{{ channel.label }}</h3>
            <p class="text-sm text-text-subtle">{{ channel.description }}</p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
