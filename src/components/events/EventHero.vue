<script setup lang="ts">
interface Props {
  readonly heading: string
  readonly intro: string
}

defineProps<Props>()
</script>

<template>
  <section class="flex flex-col items-center gap-5 bg-surface-muted px-5 py-14 text-center sm:px-8">
    <h1 class="max-w-3xl text-3xl font-bold text-text-default sm:text-4xl">
      {{ heading }}
    </h1>
    <p class="max-w-2xl text-base text-text-muted">{{ intro }}</p>
  </section>
</template>
