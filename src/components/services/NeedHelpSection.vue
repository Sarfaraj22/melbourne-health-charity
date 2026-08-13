<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import { useServicesContent } from '@/composables/useServicesContent'

const { supportChannels } = useServicesContent()
</script>

<template>
  <section aria-labelledby="need-help-heading" class="bg-surface-muted px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col items-center gap-8">
      <h2 id="need-help-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Need Help?
      </h2>
      <ul class="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        <li v-for="channel in supportChannels" :key="channel.id">
          <a
            :href="channel.href"
            class="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <BaseCard interactive class="items-center text-center">
              <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
              <span aria-hidden="true" class="text-brand-primary" v-html="channel.icon"></span>
              <h3 class="text-base font-bold text-text-default">{{ channel.title }}</h3>
              <p class="text-sm text-text-subtle">{{ channel.description }}</p>
            </BaseCard>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
