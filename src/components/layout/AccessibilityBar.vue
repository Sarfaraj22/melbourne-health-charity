<script setup lang="ts">
const accessibilityTags: readonly string[] = [
  'High Contrast',
  'Language',
  'Keyboard Navigation',
  'Screen Reader Compatible',
  'Large Buttons',
  'Clear Headings',
  'Plain English',
  'Colour-Independent Indicators',
  'Accessible Form Validation',
]
</script>

<template>
  <div class="flex flex-col gap-2 bg-surface-muted px-5 py-2.5 sm:px-8">
    <a
      href="#main-content"
      class="text-xs font-medium text-text-muted underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Skip to main content
    </a>
    <nav aria-label="Accessibility settings" class="flex flex-wrap gap-2">
      <span
        class="rounded border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-text-subtle"
      >
        Text Size: A- A+
      </span>
      <span
        v-for="tag in accessibilityTags"
        :key="tag"
        class="rounded border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-text-subtle"
      >
        {{ tag }}
      </span>
    </nav>
  </div>
</template>
