<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'

interface Props {
  readonly crumbs: readonly BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="border-b border-border-default bg-surface px-5 py-4 sm:px-8">
    <ol class="mx-auto flex max-w-container flex-wrap items-center gap-1.5 text-sm">
      <li
        v-for="(crumb, index) in crumbs"
        :key="`${crumb.label}-${index}`"
        class="flex items-center gap-1.5"
      >
        <template v-if="index > 0">
          <span aria-hidden="true" class="text-text-subtle">&gt;</span>
        </template>
        <router-link
          v-if="crumb.to"
          :to="crumb.to"
          class="text-text-subtle hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else aria-current="page" class="font-bold text-text-default">{{
          crumb.label
        }}</span>
      </li>
    </ol>
  </nav>
</template>
