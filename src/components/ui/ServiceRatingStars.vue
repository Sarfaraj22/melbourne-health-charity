<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import starIcon from '@/assets/icons/star.svg?raw'

interface Props {
  readonly rating: number
  readonly interactive?: boolean
  readonly labelledBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
})

const emit = defineEmits<{
  select: [rating: number]
}>()

const stars: readonly number[] = [1, 2, 3, 4, 5]

function isFilled(value: number): boolean {
  return value <= props.rating
}

function selectRating(value: number): void {
  emit('select', value)
}
</script>

<template>
  <div
    class="flex items-center gap-1"
    :role="props.interactive ? 'radiogroup' : 'img'"
    :aria-labelledby="props.labelledBy"
    :aria-label="props.interactive ? undefined : `${props.rating} out of 5 stars`"
  >
    <template v-if="props.interactive">
      <button
        v-for="value in stars"
        :key="value"
        type="button"
        :aria-label="`${value} star${value === 1 ? '' : 's'}`"
        :aria-pressed="isFilled(value) && props.rating === value"
        class="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        :class="
          isFilled(value)
            ? 'text-brand-accent [&>span>svg]:fill-brand-accent'
            : 'text-text-subtle [&>span>svg]:fill-none'
        "
        @click="selectRating(value)"
      >
        <AppIcon :svg="starIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
      </button>
    </template>
    <template v-else>
      <span
        v-for="value in stars"
        :key="`display-${String(value)}`"
        :class="
          isFilled(value)
            ? 'text-brand-accent [&>span>svg]:fill-brand-accent'
            : 'text-text-subtle [&>span>svg]:fill-none'
        "
      >
        <AppIcon :svg="starIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
      </span>
    </template>
  </div>
</template>
