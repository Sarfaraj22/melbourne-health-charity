<script setup lang="ts">
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
        <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
        <span aria-hidden="true" class="text-brand-primary" v-html="icon"></span>
        <h2 class="text-lg font-bold text-text-default">{{ title }}</h2>
        <p class="text-sm text-text-muted">{{ summary }}</p>
      </div>
    </BaseCard>
  </router-link>
</template>
