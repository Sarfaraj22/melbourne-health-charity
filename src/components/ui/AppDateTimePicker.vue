<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import chevronLeftIcon from '@/assets/icons/chevron-left.svg?raw'
import chevronRightIcon from '@/assets/icons/chevron-right.svg?raw'
import {
  bookingTimeSlots,
  formatDateDdMmYyyy,
  isDateBeforeDay,
  parseDateDdMmYyyy,
  startOfToday,
} from '@/utils/datetime'

interface Props {
  readonly date: string
  readonly time: string
  readonly dateInputId: string
  readonly timeInputId: string
  readonly allowPast: boolean
  readonly timeMode: 'slots' | 'text'
  readonly dateInvalid: boolean
  readonly timeInvalid: boolean
  readonly dateDescribedBy: string
  readonly timeDescribedBy: string
  readonly disabled: boolean
}

interface Emits {
  (event: 'update:date', value: string): void
  (event: 'update:time', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const weekdayLabels: readonly string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const timeSlots: readonly string[] = bookingTimeSlots()

const viewYear = ref<number>(startOfToday().getFullYear())
const viewMonth = ref<number>(startOfToday().getMonth())

watch(
  () => props.date,
  (next: string): void => {
    const parsed = parseDateDdMmYyyy(next)
    if (parsed === undefined) {
      return
    }
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  },
  { immediate: true, deep: false },
)

const isTextTime = computed((): boolean => props.timeMode === 'text')

const monthHeading = computed((): string => {
  const headingDate = new Date(viewYear.value, viewMonth.value, 1)
  return headingDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
})

interface CalendarCell {
  readonly key: string
  readonly date: Date | undefined
}

const monthCells = computed((): readonly CalendarCell[] => {
  const year = viewYear.value
  const month = viewMonth.value
  const first = new Date(year, month, 1)
  const firstWeekday = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalendarCell[] = []

  for (let pad = 0; pad < firstWeekday; pad++) {
    cells.push({ key: `pad-start-${pad}`, date: undefined })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    cells.push({ key: formatDateDdMmYyyy(date), date })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `pad-end-${cells.length}`, date: undefined })
  }

  return cells
})

const selectedSummary = computed((): string => {
  if (props.date === '' && props.time === '') {
    return 'No date selected'
  }
  if (props.time === '') {
    return props.date
  }
  if (props.date === '') {
    return props.time
  }
  return `${props.date}, ${props.time}`
})

function isDisabledDate(date: Date): boolean {
  if (props.disabled) {
    return true
  }
  if (props.allowPast) {
    return false
  }
  return isDateBeforeDay(date, startOfToday())
}

function isSelectedDate(date: Date): boolean {
  return formatDateDdMmYyyy(date) === props.date
}

function isToday(date: Date): boolean {
  return formatDateDdMmYyyy(date) === formatDateDdMmYyyy(startOfToday())
}

function dayButtonClass(date: Date): string {
  if (isSelectedDate(date)) {
    return 'bg-brand-primary text-text-on-brand'
  }
  if (isDisabledDate(date)) {
    return 'cursor-not-allowed text-text-subtle opacity-50'
  }
  if (isToday(date)) {
    return 'text-text-default ring-2 ring-brand-primary hover:bg-surface-muted'
  }
  return 'text-text-default hover:bg-surface-muted'
}

function selectDate(date: Date): void {
  if (isDisabledDate(date)) {
    return
  }
  emit('update:date', formatDateDdMmYyyy(date))
}

function selectTimeSlot(value: string): void {
  if (props.disabled) {
    return
  }
  emit('update:time', value)
}

function handleTimeTextInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    emit('update:time', target.value)
  }
}

function goToPreviousMonth(): void {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
    return
  }
  viewMonth.value -= 1
}

function goToNextMonth(): void {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
    return
  }
  viewMonth.value += 1
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="rounded p-1 text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          :disabled="disabled"
          :aria-label="`Show ${new Date(viewYear, viewMonth - 1, 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}`"
          @click="goToPreviousMonth"
        >
          <AppIcon :svg="chevronLeftIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </button>
        <p class="text-sm font-semibold text-text-default" aria-live="polite">{{ monthHeading }}</p>
        <button
          type="button"
          class="rounded p-1 text-text-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          :disabled="disabled"
          :aria-label="`Show ${new Date(viewYear, viewMonth + 1, 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}`"
          @click="goToNextMonth"
        >
          <AppIcon :svg="chevronRightIcon" class-name="[&>svg]:h-5 [&>svg]:w-5" />
        </button>
      </div>

      <div
        :id="dateInputId"
        role="grid"
        :aria-label="`Choose a date. Selected: ${selectedSummary}`"
        :aria-invalid="dateInvalid ? true : undefined"
        :aria-describedby="dateDescribedBy === '' ? undefined : dateDescribedBy"
        class="rounded border border-border-default p-2"
      >
        <div role="row" class="grid grid-cols-7">
          <span
            v-for="label in weekdayLabels"
            :key="label"
            role="columnheader"
            class="py-1 text-center text-xs font-medium text-text-subtle"
          >
            {{ label }}
          </span>
        </div>
        <div class="grid grid-cols-7">
          <template v-for="cell in monthCells" :key="cell.key">
            <span v-if="cell.date === undefined" class="aspect-square" />
            <button
              v-else
              type="button"
              role="gridcell"
              :aria-selected="isSelectedDate(cell.date)"
              :disabled="isDisabledDate(cell.date)"
              :class="[
                'aspect-square rounded text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                dayButtonClass(cell.date),
              ]"
              @click="selectDate(cell.date)"
            >
              {{ cell.date.getDate() }}
            </button>
          </template>
        </div>
      </div>
      <p class="text-xs text-text-subtle">Selected date: {{ date === '' ? 'none' : date }}</p>
    </div>

    <div v-if="isTextTime" class="flex flex-col gap-1.5">
      <input
        :id="timeInputId"
        type="text"
        :value="time"
        :disabled="disabled"
        :aria-invalid="timeInvalid ? true : undefined"
        :aria-describedby="timeDescribedBy === '' ? undefined : timeDescribedBy"
        placeholder="e.g. 10:00am - 11:30am"
        class="rounded border border-border-default px-3 py-2.5 text-sm text-text-default placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        @input="handleTimeTextInput"
      />
    </div>

    <div
      v-else
      :id="timeInputId"
      role="listbox"
      :aria-label="`Choose a time. Selected: ${time === '' ? 'none' : time}`"
      :aria-invalid="timeInvalid ? true : undefined"
      :aria-describedby="timeDescribedBy === '' ? undefined : timeDescribedBy"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="slot in timeSlots"
        :key="slot"
        type="button"
        role="option"
        :aria-selected="time === slot"
        :disabled="disabled"
        :class="[
          'rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
          time === slot
            ? 'bg-text-default text-text-on-brand'
            : 'border border-border-default bg-surface text-text-default hover:bg-surface-muted',
        ]"
        @click="selectTimeSlot(slot)"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>
