<script setup lang="ts">
import { computed } from 'vue'
import ServiceCategoryCard from '@/components/services/ServiceCategoryCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { getFeaturedCategories, useServicesContent } from '@/composables/useServicesContent'

const { categories } = useServicesContent()

const featuredCategories = computed(() => getFeaturedCategories())

const regularCategories = computed(() =>
  categories.filter((category) => category.featured !== true),
)
</script>

<template>
  <div class="bg-surface">
    <section aria-labelledby="services-heading" class="mx-auto max-w-container px-5 py-14 sm:px-8">
      <div class="flex flex-col gap-3">
        <h1 id="services-heading" class="text-3xl font-bold text-text-default sm:text-4xl">
          Our Services
        </h1>
        <p class="max-w-2xl text-base text-text-muted">
          Compassionate, NDIS-registered support across Melbourne. Browse our services below and
          book an appointment when you are ready.
        </p>
      </div>

      <div v-if="featuredCategories.length > 0" class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article
          v-for="featured in featuredCategories"
          :key="featured.id"
          class="overflow-hidden rounded-lg border border-border-default bg-surface shadow-card"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <ResponsiveImage
              v-if="featured.images"
              :image="featured.images.image"
              :image-jpg="featured.images.imageJpg"
              :image-small="featured.images.imageSmall"
              :image-small-jpg="featured.images.imageSmallJpg"
              :alt="featured.images.imageAlt"
              class-name="h-56 w-full object-cover lg:h-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div class="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <p class="text-xs font-medium uppercase tracking-wide text-brand-accent">Featured</p>
              <h2 class="text-2xl font-bold text-text-default">{{ featured.title }}</h2>
              <p class="text-base text-text-muted">{{ featured.summary }}</p>
              <AppButton :to="`/services/${featured.slug}`" variant="primary">
                View service &amp; book
              </AppButton>
            </div>
          </div>
        </article>
      </div>

      <ul class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="category in regularCategories" :key="category.id">
          <ServiceCategoryCard
            :title="category.title"
            :summary="category.summary"
            :icon="category.icon"
            :images="category.images"
            :to="`/services/${category.slug}`"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
