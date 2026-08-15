<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import ContactEmergency from '@/components/contact/ContactEmergency.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactHero from '@/components/contact/ContactHero.vue'
import ContactMethods from '@/components/contact/ContactMethods.vue'
import ContactOfficeInfo from '@/components/contact/ContactOfficeInfo.vue'

const crumbs: readonly BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Contact' }]
</script>

<template>
  <div>
    <AppBreadcrumb :crumbs="crumbs" />
    <ContactHero />
    <ContactMethods />
    <section aria-labelledby="contact-form-heading" class="bg-surface px-5 py-14 sm:px-8">
      <div class="mx-auto grid max-w-container items-start gap-10 lg:grid-cols-2">
        <ContactForm />
        <ContactOfficeInfo />
      </div>
    </section>
    <ContactEmergency />
  </div>
</template>
