<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import CommunityHero from '@/components/community/CommunityHero.vue'
import CommunityNewsList from '@/components/community/CommunityNewsList.vue'
import CommunitySuccessStories from '@/components/community/CommunitySuccessStories.vue'
import CommunityTestimonials from '@/components/community/CommunityTestimonials.vue'
import CommunitySocial from '@/components/community/CommunitySocial.vue'
import NewsletterSection from '@/components/home/NewsletterSection.vue'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Community' }]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <CommunityHero />
    <CommunityNewsList />
    <CommunitySuccessStories />
    <CommunityTestimonials />
    <CommunitySocial />
    <NewsletterSection />
  </div>
</template>
