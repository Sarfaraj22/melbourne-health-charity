<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useContactContent } from '@/composables/useContactContent'
import mapPinIcon from '@/assets/icons/map-pin.svg?raw'
import phoneIcon from '@/assets/icons/phone.svg?raw'
import mailIcon from '@/assets/icons/mail.svg?raw'
import clockIcon from '@/assets/icons/clock.svg?raw'

const { office, officeMap } = useContactContent()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 id="contact-office-heading" class="text-2xl font-bold text-text-default sm:text-3xl">
        Melbourne office
      </h2>
      <p class="text-base text-text-muted">
        Visit us in the Melbourne CBD, or get in touch by phone or email during opening hours.
      </p>
    </div>

    <ResponsiveImage
      :image="officeMap.image"
      :image-jpg="officeMap.imageJpg"
      :image-small="officeMap.imageSmall"
      :image-small-jpg="officeMap.imageSmallJpg"
      :alt="officeMap.imageAlt"
      sizes="(min-width: 1024px) 50vw, 100vw"
      class-name="h-64 w-full rounded-lg object-cover"
    />

    <ul class="flex flex-col gap-3">
      <li
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="mapPinIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Address</p>
          <p
            v-for="line in office.addressLines"
            :key="line"
            class="text-sm font-medium text-text-default"
          >
            {{ line }}
          </p>
        </div>
      </li>
      <li
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="phoneIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Phone</p>
          <a
            :href="office.phoneHref"
            class="text-sm font-medium text-brand-primary hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ office.phone }}
          </a>
        </div>
      </li>
      <li
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="mailIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex flex-col">
          <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Email</p>
          <a
            :href="office.emailHref"
            class="text-sm font-medium text-brand-primary hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ office.email }}
          </a>
        </div>
      </li>
      <li
        class="flex items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"
        >
          <AppIcon :svg="clockIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </span>
        <div class="flex w-full flex-col gap-2">
          <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">Opening hours</p>
          <dl class="flex flex-col gap-1">
            <div
              v-for="hour in office.hours"
              :key="hour.day"
              class="flex items-baseline justify-between gap-4"
            >
              <dt class="text-sm text-text-muted">{{ hour.day }}</dt>
              <dd class="text-sm font-medium text-text-default">{{ hour.time }}</dd>
            </div>
          </dl>
        </div>
      </li>
    </ul>
  </div>
</template>
