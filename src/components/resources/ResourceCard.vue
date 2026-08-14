<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import Icon from '@/components/ui/AppIcon.vue'
import type { ResourceFormat, ResourceItem } from '@/types/resource'
import downloadIcon from '@/assets/icons/download.svg?raw'
import bookmarkIcon from '@/assets/icons/bookmark.svg?raw'

interface Props {
  readonly resource: ResourceItem
  readonly isSaved: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'toggle-save': [id: string]
}>()

const formatLabel: Record<ResourceFormat, string> = {
  guide: 'Guide',
  article: 'Article',
  video: 'Video',
  'easy-read': 'Easy Read',
}

const badgeLabel = computed(() => formatLabel[props.resource.format])
const bookmarkClass = computed(
  () =>
    `inline-flex ${props.isSaved ? 'text-brand-accent' : 'text-text-subtle'} [&>svg]:h-4 [&>svg]:w-4`,
)
</script>

<template>
  <BaseCard interactive class="h-full overflow-hidden p-0">
    <ResponsiveImage
      :image="resource.images.image"
      :image-jpg="resource.images.imageJpg"
      :image-small="resource.images.imageSmall"
      :image-small-jpg="resource.images.imageSmallJpg"
      :alt="resource.images.imageAlt"
      class-name="h-32 w-full object-cover"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    />
    <div class="flex flex-1 flex-col gap-3 p-5">
      <span
        class="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary"
      >
        <Icon :svg="resource.icon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
        {{ badgeLabel }}
      </span>

      <h3 class="min-h-12 text-base font-bold text-text-default">{{ resource.title }}</h3>
      <p class="line-clamp-2 min-h-10 text-sm text-text-muted">{{ resource.summary }}</p>

      <div class="mt-auto flex items-center justify-between gap-3 pt-2">
        <a
          :href="resource.fileUrl"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          :aria-label="`Download ${resource.title}`"
        >
          <Icon :svg="downloadIcon" class-name="inline-flex [&>svg]:h-4 [&>svg]:w-4" />
          Download
        </a>

        <label
          class="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-text-muted focus-within:outline-none"
        >
          <input
            type="checkbox"
            :checked="isSaved"
            class="h-4 w-4 rounded border-border-strong text-brand-accent focus-visible:ring-brand-accent"
            :aria-label="`Save ${resource.title} to my resources`"
            @change="$emit('toggle-save', resource.id)"
          />
          <Icon :svg="bookmarkIcon" :class-name="bookmarkClass" />
          <span class="sr-only">Save</span>
        </label>
      </div>
    </div>
  </BaseCard>
</template>
