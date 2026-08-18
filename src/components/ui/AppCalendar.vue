<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'
import type { AppCalendarEvent } from '@/types/calendar'

interface Props {
  readonly events: readonly AppCalendarEvent[]
}

const props = defineProps<Props>()
const router = useRouter()

function toEventInput(event: AppCalendarEvent): EventInput {
  if (event.url === undefined) {
    return { title: event.title, start: event.start }
  }
  return { title: event.title, start: event.start, url: event.url }
}

function handleEventClick(info: EventClickArg): void {
  const url = info.event.url
  if (url === '') {
    return
  }
  info.jsEvent.preventDefault()
  void router.push(url)
}

const calendarOptions = computed((): CalendarOptions => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  height: 'auto',
  events: props.events.map(toEventInput),
  eventClick: handleEventClick,
}))
</script>

<template>
  <div class="overflow-hidden rounded-md border border-border-default bg-surface p-4">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style scoped>
:deep(.fc) {
  --fc-border-color: theme('colors.border-default');
  --fc-page-bg-color: theme('colors.surface');
  --fc-neutral-bg-color: theme('colors.surface-muted');
  --fc-today-bg-color: theme('colors.surface-muted');
  --fc-button-bg-color: theme('colors.brand-primary');
  --fc-button-border-color: theme('colors.brand-primary');
  --fc-button-hover-bg-color: theme('colors.brand-primary-dark');
  --fc-button-hover-border-color: theme('colors.brand-primary-dark');
  --fc-button-active-bg-color: theme('colors.brand-primary-dark');
  --fc-button-active-border-color: theme('colors.brand-primary-dark');
  --fc-button-text-color: theme('colors.text-on-brand');
  --fc-event-bg-color: theme('colors.brand-primary');
  --fc-event-border-color: theme('colors.brand-primary');
  --fc-event-text-color: theme('colors.text-on-brand');
  font-family: theme('fontFamily.sans');
  color: theme('colors.text-default');
}
</style>
