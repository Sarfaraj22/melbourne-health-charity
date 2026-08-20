<script setup lang="ts">
interface Props {
  readonly htmlFor: string
  readonly required: boolean
  readonly size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
})
</script>

<template>
  <label
    :for="props.htmlFor"
    :class="
      props.size === 'md'
        ? 'text-sm font-medium text-text-default'
        : 'text-xs font-medium text-text-subtle'
    "
  >
    <slot />
    <span class="font-normal">{{ props.required ? ' (required)' : ' (optional)' }}</span>
  </label>
</template>
