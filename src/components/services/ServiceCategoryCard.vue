<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import type { ServiceCategory } from '@/types/service'

interface Props {
  readonly title: string
  readonly summary: string
  readonly icon: string
  readonly to: string
  readonly images?: ServiceCategory['images']
}

defineProps<Props>()
</script>

<template>
  <router-link
    :to="to"
    class="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
  >
    <BaseCard interactive class="h-full overflow-hidden p-0">
      <ResponsiveImage
        v-if="images"
        :image="images.image"
        :image-jpg="images.imageJpg"
        :image-small="images.imageSmall"
        :image-small-jpg="images.imageSmallJpg"
        :alt="images.imageAlt"
        class-name="h-40 w-full object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div class="flex flex-col gap-2 p-4">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
        >
          <AppIcon :svg="icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
        </span>
        <h2 class="text-lg font-bold text-text-default">{{ title }}</h2>
        <p class="text-sm text-text-muted">{{ summary }}</p>
      </div>
    </BaseCard>
  </router-link>
</template>
