<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import hero1600Webp from '@/assets/images/hero-1600.webp'
import hero800Webp from '@/assets/images/hero-800.webp'
import hero1600Jpg from '@/assets/images/hero-1600.jpg'
import hero800Jpg from '@/assets/images/hero-800.jpg'
</script>

<template>
  <section aria-labelledby="hero-heading" class="flex flex-col items-center bg-surface">
    <picture>
      <source
        type="image/webp"
        :srcset="`${hero800Webp} 800w, ${hero1600Webp} 1600w`"
        sizes="100vw"
      />
      <img
        :src="hero1600Jpg"
        :srcset="`${hero800Jpg} 800w, ${hero1600Jpg} 1600w`"
        sizes="100vw"
        alt="People with disabilities receiving compassionate support in the community"
        class="h-72 w-full object-cover sm:h-96 lg:h-hero"
        width="1600"
        height="900"
        fetchpriority="high"
      />
    </picture>
    <div class="mx-auto flex w-full max-w-container flex-col items-center gap-5 px-5 py-14 sm:px-8">
      <h1
        id="hero-heading"
        class="max-w-3xl text-center text-3xl font-bold text-text-default sm:text-4xl"
      >
        Supporting People Living with Disabilities
      </h1>
      <p class="max-w-xl text-center text-base text-text-muted">
        Compassionate, NDIS-registered support services across Melbourne — helping people live
        independently, with dignity and choice.
      </p>
      <div class="flex flex-col gap-4 sm:flex-row">
        <AppButton variant="primary" to="/get-support">Book Appointment</AppButton>
        <AppButton variant="secondary" to="/services">Find Services</AppButton>
      </div>
    </div>
  </section>
</template>
