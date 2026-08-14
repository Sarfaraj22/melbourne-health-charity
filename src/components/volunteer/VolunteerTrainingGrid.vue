<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useVolunteerContent } from '@/composables/useVolunteerContent'

const { trainingResources } = useVolunteerContent()
</script>

<template>
  <section
    aria-labelledby="volunteer-training-resources-heading"
    class="bg-surface px-5 py-14 sm:px-8"
  >
    <div class="mx-auto flex max-w-container flex-col gap-6">
      <h2
        id="volunteer-training-resources-heading"
        class="text-2xl font-bold text-text-default sm:text-3xl"
      >
        Available training
      </h2>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="resource in trainingResources" :key="resource.id">
          <BaseCard interactive>
            <ResponsiveImage
              :image="resource.image"
              :image-jpg="resource.imageJpg"
              :image-small="resource.imageSmall"
              :image-small-jpg="resource.imageSmallJpg"
              :alt="resource.imageAlt"
              class-name="mb-2 h-36 w-full rounded object-cover"
            />
            <span
              class="inline-block w-fit rounded border border-brand-accent px-2.5 py-1 text-xs font-bold text-brand-accent-dark"
            >
              {{ resource.typeLabel }}
            </span>
            <h3 class="text-base font-bold text-text-default">{{ resource.title }}</h3>
            <p class="text-sm text-text-muted">{{ resource.description }}</p>
            <router-link
              to="/volunteer/portal"
              class="text-sm font-bold text-text-default underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Start training
            </router-link>
          </BaseCard>
        </li>
      </ul>
    </div>
  </section>
</template>
