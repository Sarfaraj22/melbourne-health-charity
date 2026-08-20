<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded font-bold',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-brand-primary focus-visible:ring-offset-surface',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-text-on-brand hover:bg-brand-primary-dark',
        accent: 'bg-brand-accent text-text-on-brand hover:bg-brand-accent-dark',
        donate: 'bg-brand-donate text-text-on-brand hover:bg-brand-donate-dark',
        secondary:
          'border border-brand-primary bg-surface text-brand-primary hover:bg-surface-muted',
      },
      size: {
        md: 'px-7 py-3.5 text-base',
        sm: 'px-6 py-3 text-sm',
        xs: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  type?: 'button' | 'submit' | 'reset'
  to?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  to: '',
  disabled: false,
})

const classes = computed(() => buttonVariants({ variant: props.variant, size: props.size }))
</script>

<template>
  <router-link v-if="to" :to="to" :class="classes">
    <slot />
  </router-link>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
