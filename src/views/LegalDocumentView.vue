<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import EventHero from '@/components/events/EventHero.vue'
import { getLegalDocument } from '@/composables/useLegalContent'

interface Props {
  readonly slug: string
}

const props = defineProps<Props>()
const router = useRouter()

const document = computed(() => getLegalDocument(props.slug))

watch(
  document,
  (value) => {
    if (value === undefined) {
      void router.replace('/')
    }
  },
  { immediate: true },
)

const crumbs = computed((): readonly BreadcrumbItem[] => {
  const current = document.value
  if (current === undefined) {
    return [{ label: 'Home', to: '/' }]
  }
  return [{ label: 'Home', to: '/' }, { label: current.title }]
})
</script>

<template>
  <div v-if="document">
    <AppBreadcrumb :crumbs="crumbs" />
    <EventHero :heading="document.title" :intro="document.intro" />
    <article class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto flex max-w-container flex-col gap-10">
        <p class="text-sm text-text-subtle">Last updated {{ document.lastUpdated }}</p>
        <section
          v-for="section in document.sections"
          :key="section.id"
          :aria-labelledby="`${section.id}-heading`"
          class="flex max-w-3xl flex-col gap-3"
        >
          <h2 :id="`${section.id}-heading`" class="text-xl font-bold text-text-default">
            {{ section.heading }}
          </h2>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
            class="text-base text-text-muted"
          >
            {{ paragraph }}
          </p>
        </section>
      </div>
    </article>
  </div>
</template>
