<script setup lang="ts">
interface Props {
  as?: string
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  as: 'article',
  interactive: false,
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'flex flex-col gap-2.5 rounded-lg border border-border-default bg-surface p-4',
      interactive ? 'shadow-card transition-shadow hover:shadow-card-hover' : '',
    ]"
  >
    <slot />
  </component>
</template>
