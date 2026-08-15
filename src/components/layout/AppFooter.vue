<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLogo from '@/components/ui/AppLogo.vue'

import facebookIcon from '@/assets/icons/facebook.svg?raw'
import twitterIcon from '@/assets/icons/twitter.svg?raw'
import instagramIcon from '@/assets/icons/instagram.svg?raw'
import linkedinIcon from '@/assets/icons/linkedin.svg?raw'

interface FooterLink {
  readonly label: string
  readonly to: string
}

const quickLinks: readonly FooterLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Donate', to: '/donate' },
  { label: 'Volunteer', to: '/volunteer' },
]

const legalLinks: readonly FooterLink[] = [
  { label: 'Accessibility Statement', to: '/legal' },
  { label: 'Privacy Policy', to: '/legal' },
  { label: 'Terms of Use', to: '/legal' },
]

const contactDetails: readonly string[] = [
  '123 Support Street, Melbourne VIC 3000',
  'Phone: 1800 123 456',
  'Email: hello@charity.org.au',
]

interface SocialLink {
  readonly label: string
  readonly icon: string
  readonly to: string
}

const socialLinks: readonly SocialLink[] = [
  { label: 'Facebook', icon: facebookIcon, to: '/community' },
  { label: 'Twitter', icon: twitterIcon, to: '/community' },
  { label: 'Instagram', icon: instagramIcon, to: '/community' },
  { label: 'LinkedIn', icon: linkedinIcon, to: '/community' },
]
</script>

<template>
  <footer class="bg-surface-muted px-5 pt-14 sm:px-8">
    <div class="mx-auto flex max-w-container flex-col gap-8">
      <div class="flex flex-col gap-12 sm:flex-row sm:flex-wrap">
        <div class="flex w-full flex-col gap-3 sm:w-56">
          <AppLogo size="sm" />
          <p class="text-sm text-text-muted">
            Supporting people living with disabilities across Melbourne, Victoria.
          </p>
          <ul class="flex gap-3" aria-label="Social media">
            <li v-for="social in socialLinks" :key="social.label">
              <router-link
                :to="social.to"
                :aria-label="social.label"
                :title="social.label"
                class="flex h-9 w-9 items-center justify-center rounded-full bg-border-strong text-text-default transition-colors hover:bg-brand-primary hover:text-text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <AppIcon :svg="social.icon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
              </router-link>
            </li>
          </ul>
        </div>

        <nav aria-label="Quick links" class="flex flex-1 flex-col gap-3">
          <h2 class="text-sm font-bold text-text-default">Quick Links</h2>
          <ul class="flex flex-col gap-3">
            <li v-for="link in quickLinks" :key="link.label">
              <router-link
                :to="link.to"
                class="text-sm text-text-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal" class="flex flex-1 flex-col gap-3">
          <h2 class="text-sm font-bold text-text-default">Legal</h2>
          <ul class="flex flex-col gap-3">
            <li v-for="link in legalLinks" :key="link.label">
              <router-link
                :to="link.to"
                class="text-sm text-text-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="flex w-full flex-col gap-3 sm:w-60">
          <h2 class="text-sm font-bold text-text-default">Contact</h2>
          <p v-for="detail in contactDetails" :key="detail" class="text-sm text-text-muted">
            {{ detail }}
          </p>
        </div>
      </div>

      <hr class="border-border-strong" />

      <p class="pb-7 text-center text-xs text-text-subtle">
        © 2026 Melbourne Disability Support Charity. All rights reserved.
      </p>
    </div>
  </footer>
</template>
