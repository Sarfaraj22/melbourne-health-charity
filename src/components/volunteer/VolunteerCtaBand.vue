<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

interface Props {
  readonly heading: string
  readonly intro: string
  readonly buttonLabel: string
  readonly buttonTo: string
}

defineProps<Props>()
</script>

<template>
  <section class="bg-surface px-5 py-14 text-center sm:px-8">
    <div class="mx-auto flex max-w-container flex-col items-center gap-4">
      <h2 class="max-w-3xl text-2xl font-bold text-text-default sm:text-3xl">
        {{ heading }}
      </h2>
      <p class="max-w-2xl text-base text-text-muted">{{ intro }}</p>
      <AppButton variant="primary" :to="buttonTo">{{ buttonLabel }}</AppButton>
    </div>
  </section>
</template>
