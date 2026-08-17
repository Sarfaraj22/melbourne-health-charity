<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import { useAuthStore } from '@/stores/auth.store'
import userIcon from '@/assets/icons/user.svg?raw'

interface NavLink {
  readonly label: string
  readonly to: string
}

const navLinks: readonly NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Community', to: '/community' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Donate', to: '/donate' },
  { label: 'Contact', to: '/contact' },
]

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const accountLinkLabel = computed<string>(() => {
  switch (authStore.role) {
    case 'admin':
      return 'Admin'
    case 'volunteer':
      return 'Volunteer Portal'
    default:
      return 'My Dashboard'
  }
})

const accountLinkTo = computed<string>(() => authStore.roleHome())

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu(): void {
  isMenuOpen.value = false
}

function isNavActive(link: NavLink): boolean {
  if (link.to === '/') {
    return route.path === '/'
  }
  return route.path === link.to || route.path.startsWith(`${link.to}/`)
}

async function handleLogout(): Promise<void> {
  closeMenu()
  await authStore.signOut()
  void router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border-default bg-surface">
    <!-- Top bar: logo + mobile menu toggle (mobile) / logo + nav + actions (desktop) -->
    <div
      class="mx-auto flex max-w-container items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:gap-8"
    >
      <AppLogo size="md" class="shrink-0" @click="closeMenu" />

      <button
        type="button"
        class="rounded border border-border-strong p-2 text-text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary md:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-nav"
        @click="toggleMenu"
      >
        {{ isMenuOpen ? 'Close' : 'Menu' }}
      </button>

      <nav
        id="primary-nav"
        aria-label="Primary"
        class="hidden md:flex md:items-center md:gap-5 lg:gap-8"
      >
        <ul class="flex flex-row items-center gap-5 lg:gap-8">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              :class="[
                'text-base font-medium hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                isNavActive(link) ? 'text-brand-primary' : 'text-text-default',
              ]"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="hidden shrink-0 items-center gap-5 md:flex">
        <template v-if="authStore.isAuthenticated">
          <router-link
            :to="accountLinkTo"
            class="flex items-center gap-1.5 text-base font-medium text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <AppIcon :svg="userIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
            {{ accountLinkLabel }}
          </router-link>
          <button
            type="button"
            class="text-base font-medium text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <router-link
          v-else
          to="/login"
          class="flex items-center gap-1.5 text-base font-medium text-text-default hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <AppIcon :svg="userIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
          Login
        </router-link>
        <AppButton
          variant="donate"
          size="sm"
          to="/donate/make-a-donation"
          class="shrink-0 whitespace-nowrap"
        >
          Make a donation
        </AppButton>
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
            :class="[
              'block rounded px-3 py-2.5 text-base font-medium hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
              isNavActive(link) ? 'text-brand-primary' : 'text-text-default',
            ]"
            @click="closeMenu"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
      <hr class="my-3 border-border-default" />
      <div class="flex flex-col gap-3">
        <template v-if="authStore.isAuthenticated">
          <router-link
            :to="accountLinkTo"
            class="block rounded px-3 py-2.5 text-base font-medium text-text-default hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @click="closeMenu"
          >
            {{ accountLinkLabel }}
          </router-link>
          <button
            type="button"
            class="block rounded px-3 py-2.5 text-left text-base font-medium text-text-default hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <router-link
          v-else
          to="/login"
          class="block rounded px-3 py-2.5 text-base font-medium text-text-default hover:bg-surface-muted hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @click="closeMenu"
        >
          Login
        </router-link>
        <AppButton
          variant="donate"
          size="sm"
          to="/donate/make-a-donation"
          class="w-full whitespace-nowrap"
          @click="closeMenu"
        >
          Make a donation
        </AppButton>
      </div>
    </nav>
  </header>
</template>
