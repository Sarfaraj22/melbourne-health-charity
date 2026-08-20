<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import messageCircleIcon from '@/assets/icons/message-circle.svg?raw'

const route = useRoute()

const isHidden = computed<boolean>(() => {
  const path = route.path
  return (
    path === '/get-support/live-chat' ||
    path === '/dashboard' ||
    path.startsWith('/volunteer/portal') ||
    path.startsWith('/admin/')
  )
})
</script>

<template>
  <router-link
    v-if="!isHidden"
    to="/get-support/live-chat"
    class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-sm font-bold text-text-on-brand shadow-card hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:bottom-8 sm:right-8"
    aria-label="Open live chat"
  >
    <AppIcon :svg="messageCircleIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
    <span class="hidden sm:inline">Live chat</span>
  </router-link>
</template>
