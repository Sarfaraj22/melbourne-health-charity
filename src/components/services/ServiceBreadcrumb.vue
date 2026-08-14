<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

interface Props {
  readonly crumbs: readonly BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <AppBreadcrumb :crumbs="crumbs" />
</template>
