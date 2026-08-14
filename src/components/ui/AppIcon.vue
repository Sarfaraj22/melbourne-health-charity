<script setup lang="ts">
interface Props {
  readonly svg: string
  readonly className?: string
}

const props = withDefaults(defineProps<Props>(), { className: '' })
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- icon SVGs are trusted local assets, not user input -->
  <span aria-hidden="true" :class="props.className" v-html="props.svg" />
</template>
