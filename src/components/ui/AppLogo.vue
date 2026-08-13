<script setup lang="ts">
import { computed } from 'vue'
import logoUrl from '@/assets/images/logo.svg'

interface Props {
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const heightClass = computed(() => (props.size === 'sm' ? 'h-7' : 'h-9'))
</script>

<template>
  <router-link
    to="/"
    aria-label="Melbourne Health — home"
    class="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
  >
    <img
      :src="logoUrl"
      alt="Melbourne Health"
      :class="['w-auto', heightClass]"
      width="380"
      height="64"
    />
  </router-link>
</template>
