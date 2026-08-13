<script setup lang="ts">
import { computed } from 'vue'
import ServiceDetailPage from '@/components/services/ServiceDetailPage.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { getCategoryBySlug, getSubServiceBySlug } from '@/composables/useServicesContent'
import type { BreadcrumbItem } from '@/types/service'

interface Props {
  readonly categorySlug: string
  readonly subServiceSlug: string
}

const props = defineProps<Props>()

const category = computed(() => getCategoryBySlug(props.categorySlug))
const subService = computed(() => getSubServiceBySlug(props.categorySlug, props.subServiceSlug))

const crumbs = computed((): readonly BreadcrumbItem[] => {
  if (category.value === undefined || subService.value === undefined) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Services', to: '/services' },
      { label: 'Not found' },
    ]
  }
  return [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: category.value.title, to: `/services/${category.value.slug}` },
    { label: subService.value.title },
  ]
})
</script>

<template>
  <ServiceDetailPage v-if="subService" :detail="subService" :crumbs="crumbs" />

  <section
    v-else
    class="mx-auto flex min-h-placeholder max-w-container flex-col items-center justify-center gap-3 px-5 py-20 text-center sm:px-8"
  >
    <h1 class="text-3xl font-bold text-text-default">Service not found</h1>
    <p class="max-w-md text-base text-text-muted">
      We could not find the service you are looking for. Browse our available services instead.
    </p>
    <AppButton to="/services" variant="secondary">View all services</AppButton>
  </section>
</template>
