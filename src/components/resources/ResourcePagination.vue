<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/AppIcon.vue'
import chevronLeftIcon from '@/assets/icons/chevron-left.svg?raw'
import chevronRightIcon from '@/assets/icons/chevron-right.svg?raw'

interface Props {
  readonly currentPage: number
  readonly totalPages: number
}

const props = defineProps<Props>()

defineEmits<{
  'go-to-page': [page: number]
}>()

const pages = computed(() => {
  const total = props.totalPages
  const result: number[] = []
  for (let page = 1; page <= total; page += 1) {
    result.push(page)
  }
  return result
})

const isFirstPage = computed(() => props.currentPage <= 1)
const isLastPage = computed(() => props.currentPage >= props.totalPages)
</script>

<template>
  <nav aria-label="Pagination" class="flex items-center justify-center gap-2">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="isFirstPage"
      :aria-disabled="isFirstPage"
      @click="$emit('go-to-page', currentPage - 1)"
    >
      <Icon :svg="chevronLeftIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
      <span class="sr-only">Previous page</span>
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      type="button"
      :class="[
        'rounded border px-3.5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
        page === currentPage
          ? 'border-brand-primary bg-brand-primary text-text-on-brand'
          : 'border-border-strong bg-surface text-text-default hover:bg-surface-muted',
      ]"
      :aria-current="page === currentPage ? 'page' : undefined"
      :aria-label="`Go to page ${page}`"
      @click="$emit('go-to-page', page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="isLastPage"
      :aria-disabled="isLastPage"
      @click="$emit('go-to-page', currentPage + 1)"
    >
      Next
      <Icon :svg="chevronRightIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
      <span class="sr-only">Next page</span>
    </button>
  </nav>
</template>
