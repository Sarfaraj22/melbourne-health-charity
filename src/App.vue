<script setup lang="ts">
import { watch } from 'vue'
import AccessibilityBar from '@/components/layout/AccessibilityBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAccessibilityStore } from '@/stores/accessibility.store'
import { assertNever } from '@/utils/assertNever'
import type { TextScale } from '@/stores/accessibility.store'

const a11y = useAccessibilityStore()

function textScaleClass(scale: TextScale): string | null {
  switch (scale) {
    case 'default':
      return null
    case 'large':
      return 'a11y-text-large'
    case 'xl':
      return 'a11y-text-xl'
    default:
      return assertNever(scale)
  }
}

function applyDocumentClasses(): void {
  const root = document.documentElement
  root.classList.remove('a11y-text-large', 'a11y-text-xl')
  const scaleClass = textScaleClass(a11y.textScale)
  if (scaleClass !== null) {
    root.classList.add(scaleClass)
  }
  root.classList.toggle('a11y-contrast', a11y.highContrast)
  root.classList.toggle('a11y-large-controls', a11y.largeControls)
  root.classList.toggle('a11y-underline-links', a11y.underlineLinks)
  root.classList.toggle('a11y-plain-reading', a11y.plainReading)
}

watch(
  () =>
    [
      a11y.textScale,
      a11y.highContrast,
      a11y.largeControls,
      a11y.underlineLinks,
      a11y.plainReading,
    ] as const,
  () => {
    applyDocumentClasses()
  },
  { immediate: true, deep: false },
)
</script>

<template>
  <AccessibilityBar />
  <AppHeader />
  <main id="main-content" class="flex flex-col">
    <router-view />
  </main>
  <AppFooter />
</template>
