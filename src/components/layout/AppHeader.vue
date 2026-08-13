<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLogo from '@/components/ui/AppLogo.vue'

interface NavLink {
  readonly label: string
  readonly to: string
}

const navLinks: readonly NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Contact', to: '/contact' },
]

const isMenuOpen = ref(false)

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu(): void {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border-default bg-surface">
    <!-- Top bar: logo + mobile menu toggle (mobile) / logo + nav + actions (desktop) -->
    <div class="mx-auto flex max-w-container items-center justify-between px-5 py-4 sm:px-8">
      <AppLogo size="md" @click="closeMenu" />

      <button
        type="button"
        class="rounded border border-border-strong p-2 text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary md:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-nav"
        @click="toggleMenu"
      >
        {{ isMenuOpen ? 'Close' : 'Menu' }}
      </button>

      <nav id="primary-nav" aria-label="Primary" class="hidden md:flex md:items-center md:gap-8">
        <ul class="flex flex-row items-center gap-8">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              class="text-base font-medium text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="hidden items-center gap-5 md:flex">
        <router-link
          to="/login"
          class="flex items-center gap-1.5 text-base font-medium text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <span aria-hidden="true">👤</span>
          Login
        </router-link>
        <AppButton variant="accent" to="/donate">Donate</AppButton>
      </div>
    </div>

    <!-- Mobile dropdown panel -->
    <nav
      v-if="isMenuOpen"
      aria-label="Primary"
      class="border-t border-border-default bg-surface px-5 py-4 md:hidden"
    >
      <ul class="flex flex-col gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="block rounded px-3 py-2.5 text-base font-medium text-text-default hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @click="closeMenu"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
      <hr class="my-3 border-border-default" />
      <div class="flex flex-col gap-3">
        <router-link
          to="/login"
          class="block rounded px-3 py-2.5 text-base font-medium text-text-default hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @click="closeMenu"
        >
          Login
        </router-link>
        <AppButton variant="accent" to="/donate" class="w-full" @click="closeMenu">
          Donate
        </AppButton>
      </div>
    </nav>
  </header>
</template>
