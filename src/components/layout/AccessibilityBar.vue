<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility.store'

const a11y = useAccessibilityStore()
const isLanguageOpen = ref(false)

const chipClass =
  'rounded border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'

const toggleOnClass =
  'rounded border border-brand-primary bg-brand-primary px-2.5 py-1 text-xs font-medium text-text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'

function toggleClass(isOn: boolean): string {
  return isOn ? toggleOnClass : chipClass
}

const statusChips: readonly { readonly label: string; readonly title: string }[] = [
  {
    label: 'Keyboard Navigation',
    title: 'All interactive controls can be reached with a keyboard.',
  },
  {
    label: 'Screen Reader Compatible',
    title: 'Pages use semantic headings, labels, and text alternatives.',
  },
  {
    label: 'Clear Headings',
    title: 'Content is organised with a visible heading structure.',
  },
  {
    label: 'Accessible Form Validation',
    title: 'Forms include labels, error messages, and success confirmation.',
  },
]

const canDecreaseText = computed((): boolean => a11y.textScale !== 'default')
const canIncreaseText = computed((): boolean => a11y.textScale !== 'xl')

function toggleLanguage(): void {
  isLanguageOpen.value = !isLanguageOpen.value
}
</script>

<template>
  <div class="flex flex-col gap-2 bg-surface-muted px-5 py-2.5 sm:px-8">
    <a
      href="#main-content"
      class="text-xs font-medium text-text-muted underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Skip to main content
    </a>
    <nav aria-label="Accessibility settings" class="flex flex-wrap items-center gap-2">
      <div
        class="flex items-center gap-1 rounded border border-border-strong bg-surface px-2.5 py-1"
      >
        <span class="text-xs font-medium text-text-subtle">Text Size</span>
        <button
          type="button"
          class="px-1 text-xs font-bold text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease text size"
          :disabled="!canDecreaseText"
          @click="a11y.decreaseTextScale"
        >
          A-
        </button>
        <button
          type="button"
          class="px-1 text-xs font-bold text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase text size"
          :disabled="!canIncreaseText"
          @click="a11y.increaseTextScale"
        >
          A+
        </button>
      </div>

      <button
        type="button"
        :class="toggleClass(a11y.highContrast)"
        :aria-pressed="a11y.highContrast"
        @click="a11y.toggleHighContrast"
      >
        High Contrast
      </button>

      <div class="relative">
        <button
          type="button"
          :class="chipClass"
          :aria-expanded="isLanguageOpen"
          aria-controls="language-menu"
          @click="toggleLanguage"
        >
          Language
        </button>
        <div
          v-if="isLanguageOpen"
          id="language-menu"
          class="absolute left-0 z-50 mt-1 w-56 rounded border border-border-default bg-surface p-3 shadow-card"
        >
          <p class="text-xs font-medium text-text-default">English (current)</p>
          <router-link
            to="/accessibility-statement"
            class="mt-2 block text-xs text-brand-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @click="isLanguageOpen = false"
          >
            Other languages and Easy Read
          </router-link>
        </div>
      </div>

      <button
        type="button"
        :class="toggleClass(a11y.largeControls)"
        :aria-pressed="a11y.largeControls"
        @click="a11y.toggleLargeControls"
      >
        Large Buttons
      </button>

      <button
        type="button"
        :class="toggleClass(a11y.plainReading)"
        :aria-pressed="a11y.plainReading"
        @click="a11y.togglePlainReading"
      >
        Plain English
      </button>

      <button
        type="button"
        :class="toggleClass(a11y.underlineLinks)"
        :aria-pressed="a11y.underlineLinks"
        @click="a11y.toggleUnderlineLinks"
      >
        Colour-Independent Indicators
      </button>

      <span v-for="chip in statusChips" :key="chip.label" :class="chipClass" :title="chip.title">
        {{ chip.label }}
      </span>
    </nav>
  </div>
</template>
