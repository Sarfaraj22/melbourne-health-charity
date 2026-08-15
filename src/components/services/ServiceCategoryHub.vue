<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import ServiceBreadcrumb from '@/components/services/ServiceBreadcrumb.vue'
import ServiceCategoryCard from '@/components/services/ServiceCategoryCard.vue'
import PageHero from '@/components/ui/PageHero.vue'
import type { BreadcrumbItem, ServiceCategory } from '@/types/service'

interface Props {
  readonly category: ServiceCategory & { readonly kind: 'group' }
  readonly crumbs: readonly BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-surface">
    <ServiceBreadcrumb :crumbs="crumbs" />

    <PageHero
      v-if="category.images"
      heading-id="category-heading"
      :heading="category.title"
      :intro="category.summary"
      :image="category.images"
    />

    <section
      aria-labelledby="available-services-heading"
      class="mx-auto max-w-container px-5 py-14 sm:px-8"
    >
      <div v-if="!category.images" class="mb-10 flex flex-col gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-muted text-brand-primary"
        >
          <AppIcon :svg="category.icon" class-name="[&>svg]:h-6 [&>svg]:w-6" />
        </span>
        <h1 id="category-heading" class="text-3xl font-bold text-text-default sm:text-4xl">
          {{ category.title }}
        </h1>
        <p class="max-w-2xl text-base text-text-muted">{{ category.summary }}</p>
      </div>

      <h2 id="available-services-heading" class="mb-6 text-2xl font-bold text-text-default">
        Available Services
      </h2>
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="subService in category.subServices" :key="subService.slug">
          <ServiceCategoryCard
            :title="subService.title"
            :summary="subService.summary"
            :icon="subService.icon"
            :to="`/services/${category.slug}/${subService.slug}`"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
