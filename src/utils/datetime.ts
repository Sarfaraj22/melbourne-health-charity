import type { AppCalendarEvent } from '@/types/calendar'

const DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/
const TIME_PATTERN = /^(\d{1,2}):(\d{2})(am|pm)$/i

export interface ParsedTime {
  readonly hours: number
  readonly minutes: number
}

export function formatDateDdMmYyyy(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}-${month}-${year}`
}

export function parseDateDdMmYyyy(value: string): Date | undefined {
  const match = DATE_PATTERN.exec(value.trim())
  if (match === null) {
    return undefined
  }

  const dayToken = match[1]
  const monthToken = match[2]
  const yearToken = match[3]
  if (dayToken === undefined || monthToken === undefined || yearToken === undefined) {
    return undefined
  }

  const day = Number(dayToken)
  const month = Number(monthToken)
  const year = Number(yearToken)
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined
  }

  const parsed = new Date(year, month - 1, day)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return undefined
  }

  return parsed
}

export function isValidDateDdMmYyyy(value: string): boolean {
  return parseDateDdMmYyyy(value) !== undefined
}

export function formatTimeAmPm(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'pm' : 'am'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')}${period}`
}

export function parseTimeAmPm(value: string): ParsedTime | undefined {
  const match = TIME_PATTERN.exec(value.trim())
  if (match === null) {
    return undefined
  }

  const hourToken = match[1]
  const minuteToken = match[2]
  const periodToken = match[3]
  if (hourToken === undefined || minuteToken === undefined || periodToken === undefined) {
    return undefined
  }

  const hour12 = Number(hourToken)
  const minutes = Number(minuteToken)
  if (hour12 < 1 || hour12 > 12 || minutes < 0 || minutes > 59) {
    return undefined
  }

  const period = periodToken.toLowerCase()
  let hours = hour12 % 12
  if (period === 'pm') {
    hours += 12
  }

  return { hours, minutes }
}

export function isValidTimeAmPm(value: string): boolean {
  return parseTimeAmPm(value) !== undefined
}

export function parseTimeRangeStart(value: string): ParsedTime | undefined {
  const firstPart = value.split('-')[0]
  if (firstPart === undefined) {
    return undefined
  }
  return parseTimeAmPm(firstPart.trim())
}

export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isDateBeforeDay(date: Date, limit: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(limit).getTime()
}

const MONTH_BADGES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

export function formatDateBadge(date: string): string {
  const parsed = parseDateDdMmYyyy(date)
  if (parsed === undefined) {
    return date
  }
  const month = MONTH_BADGES[parsed.getMonth()]
  if (month === undefined) {
    return date
  }
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${day} ${month}`
}

export function formatMillisAsDdMmYyyy(millis: number): string {
  return formatDateDdMmYyyy(new Date(millis))
}

export function daysFromToday(date: Date): number {
  const today = startOfToday().getTime()
  const target = startOfDay(date).getTime()
  return Math.round((target - today) / (24 * 60 * 60 * 1000))
}

export function bookingTimeSlots(): readonly string[] {
  const slots: string[] = []
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(formatTimeAmPm(hour, 0))
    if (hour < 17) {
      slots.push(formatTimeAmPm(hour, 30))
    }
  }
  return slots
}

export function toCalendarEvent(
  title: string,
  date: string,
  time: string,
  url?: string,
): AppCalendarEvent | undefined {
  const start = toFullCalendarStart(date, time)
  if (start === undefined) {
    return undefined
  }
  if (url === undefined) {
    return { title, start }
  }
  return { title, start, url }
}

export function toFullCalendarStart(date: string, time?: string): string | undefined {
  const parsedDate = parseDateDdMmYyyy(date)
  if (parsedDate === undefined) {
    return undefined
  }

  const year = String(parsedDate.getFullYear())
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const isoDate = `${year}-${month}-${day}`

  if (time === undefined || time.trim() === '') {
    return isoDate
  }

  const parsedTime = parseTimeAmPm(time) ?? parseTimeRangeStart(time)
  if (parsedTime === undefined) {
    return isoDate
  }

  const hours = String(parsedTime.hours).padStart(2, '0')
  const minutes = String(parsedTime.minutes).padStart(2, '0')
  return `${isoDate}T${hours}:${minutes}:00`
}
