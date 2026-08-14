<script setup lang="ts">
interface Props {
  readonly image: string
  readonly imageJpg: string
  readonly imageSmall: string
  readonly imageSmallJpg: string
  readonly alt: string
  readonly sizes?: string
  readonly width?: number
  readonly height?: number
  readonly loading?: 'eager' | 'lazy'
  readonly className?: string
}

const props = withDefaults(defineProps<Props>(), {
  sizes: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  width: 800,
  height: 450,
  loading: 'lazy',
  className: '',
})
</script>

<template>
  <picture class="block h-full w-full">
    <source
      type="image/webp"
      :srcset="`${props.imageSmall} 400w, ${props.image} 800w`"
      :sizes="props.sizes"
    />
    <img
      :src="props.imageJpg"
      :srcset="`${props.imageSmallJpg} 400w, ${props.imageJpg} 800w`"
      :sizes="props.sizes"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :loading="props.loading"
      :class="props.className"
    />
  </picture>
</template>
