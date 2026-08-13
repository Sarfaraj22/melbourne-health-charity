<script setup lang="ts">
import AccessibilityBar from '@/components/layout/AccessibilityBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <AccessibilityBar />
  <AppHeader />
  <main id="main-content" class="flex flex-col">
    <router-view />
  </main>
  <AppFooter />
</template>
