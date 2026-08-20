<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapboxTokenState } from '@/env'
import type { PartnerService } from '@/composables/usePartnerServices'

interface Props {
  readonly services: readonly PartnerService[]
}

const props = defineProps<Props>()

const mapEl = ref<HTMLDivElement | null>(null)
const tokenState = mapboxTokenState()
let map: mapboxgl.Map | undefined
const markers: mapboxgl.Marker[] = []
let resizeObserver: ResizeObserver | undefined
let cancelled = false

function directionsUrl(service: PartnerService): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(service.address)}`
}

function fitPartnerBounds(instance: mapboxgl.Map): void {
  const first = props.services[0]
  if (first === undefined) {
    return
  }
  if (props.services.length === 1) {
    instance.setCenter([first.longitude, first.latitude])
    instance.setZoom(12)
    return
  }
  const bounds = new mapboxgl.LngLatBounds()
  for (const service of props.services) {
    bounds.extend([service.longitude, service.latitude])
  }
  instance.fitBounds(bounds, { padding: 48, maxZoom: 14 })
}

async function initMap(): Promise<void> {
  await nextTick()
  if (
    cancelled ||
    tokenState.status !== 'ok' ||
    mapEl.value === null ||
    props.services.length === 0
  ) {
    return
  }
  const first = props.services[0]
  if (first === undefined) {
    return
  }
  mapboxgl.accessToken = tokenState.token
  const instance = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [first.longitude, first.latitude],
    zoom: 10,
  })
  map = instance
  instance.addControl(new mapboxgl.NavigationControl(), 'top-right')
  for (const service of props.services) {
    const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: false }).setText(
      `${service.name}. ${service.address}. ${service.phone}.`,
    )
    // Mapbox Marker only accepts a CSS colour string; brand-primary token is #1e40af.
    const marker = new mapboxgl.Marker({ color: '#1e40af' })
      .setLngLat([service.longitude, service.latitude])
      .setPopup(popup)
      .addTo(instance)
    markers.push(marker)
  }
  instance.on('load', () => {
    instance.resize()
    fitPartnerBounds(instance)
  })
  resizeObserver = new ResizeObserver(() => {
    instance.resize()
  })
  resizeObserver.observe(mapEl.value)
}

onMounted(() => {
  void initMap()
})

onUnmounted(() => {
  cancelled = true
  resizeObserver?.disconnect()
  resizeObserver = undefined
  for (const marker of markers) {
    marker.remove()
  }
  markers.length = 0
  if (map !== undefined) {
    map.remove()
    map = undefined
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <p v-if="tokenState.status === 'missing'" class="text-sm text-text-muted" role="status">
      Maps are unavailable because a Mapbox public access token is not configured.
    </p>
    <p v-else-if="tokenState.status === 'secret'" class="text-sm text-text-muted" role="status">
      Maps need a Mapbox public token (it starts with pk.), not a secret token. Create a default
      public token in your
      <a
        href="https://account.mapbox.com/access-tokens/"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Mapbox access tokens
      </a>
      page, set VITE_MAPBOX_ACCESS_TOKEN, then restart the dev server.
    </p>
    <div v-else class="h-map w-full overflow-hidden rounded-md border border-border-default">
      <div ref="mapEl" class="h-full w-full" />
    </div>
    <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <li
        v-for="service in props.services"
        :key="service.id"
        class="flex flex-col gap-2 rounded-md border border-border-default bg-surface p-4"
      >
        <h3 class="text-base font-bold text-text-default">{{ service.name }}</h3>
        <p class="text-sm text-text-muted">{{ service.offers }}</p>
        <p class="text-sm text-text-default">{{ service.address }}</p>
        <p class="text-sm text-text-default">
          <a
            :href="`tel:${service.phone.replaceAll(' ', '')}`"
            class="underline hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ service.phone }}
          </a>
        </p>
        <a
          :href="directionsUrl(service)"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded border border-brand-primary bg-surface px-6 py-3 text-sm font-bold text-brand-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Directions
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Size only Mapbox’s inner canvas; do not set height:100% on .mapboxgl-map (it is the container). */
:deep(.mapboxgl-canvas-container),
:deep(.mapboxgl-canvas) {
  width: 100%;
  height: 100%;
}
</style>
