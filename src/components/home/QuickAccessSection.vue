<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import { useHomeContent } from '@/composables/useHomeContent'

const { quickAccess } = useHomeContent()
</script>

<template>
  <section aria-labelledby="quick-access-heading" class="bg-surface px-5 py-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2 id="quick-access-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Quick Access
      </h2>
      <ul class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        <li v-for="item in quickAccess" :key="item.id">
          <router-link
            :to="item.to"
            class="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <BaseCard interactive class="items-center text-center">
              <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
              <span aria-hidden="true" class="text-brand-primary" v-html="item.icon"></span>
              <p class="text-sm font-medium text-text-default">{{ item.label }}</p>
            </BaseCard>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
