import { defineStore } from 'pinia'
import { ref } from 'vue'
import { assertNever } from '@/utils/assertNever'

export type TextScale = 'default' | 'large' | 'xl'

export interface AccessibilityState {
  readonly textScale: TextScale
  readonly highContrast: boolean
  readonly largeControls: boolean
  readonly underlineLinks: boolean
  readonly plainReading: boolean
}

export interface UseAccessibilityStoreReturn {
  readonly textScale: TextScale
  readonly highContrast: boolean
  readonly largeControls: boolean
  readonly underlineLinks: boolean
  readonly plainReading: boolean
  increaseTextScale: () => void
  decreaseTextScale: () => void
  toggleHighContrast: () => void
  toggleLargeControls: () => void
  toggleUnderlineLinks: () => void
  togglePlainReading: () => void
}

const STORAGE_KEY = 'mhc-accessibility'

const defaultState: AccessibilityState = {
  textScale: 'default',
  highContrast: false,
  largeControls: false,
  underlineLinks: false,
  plainReading: false,
}

function getOwn(source: object, key: string): unknown {
  const match = Object.entries(source).find((entry) => entry[0] === key)
  if (match === undefined) {
    return undefined
  }
  return match[1]
}

function isTextScale(value: unknown): value is TextScale {
  return value === 'default' || value === 'large' || value === 'xl'
}

function isPersistedState(value: unknown): value is AccessibilityState {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return (
    isTextScale(getOwn(value, 'textScale')) &&
    typeof getOwn(value, 'highContrast') === 'boolean' &&
    typeof getOwn(value, 'largeControls') === 'boolean' &&
    typeof getOwn(value, 'underlineLinks') === 'boolean' &&
    typeof getOwn(value, 'plainReading') === 'boolean'
  )
}

function readPersistedState(): AccessibilityState {
  if (typeof window === 'undefined') {
    return defaultState
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === null) {
    return defaultState
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (isPersistedState(parsed)) {
      return parsed
    }
  } catch {
    return defaultState
  }
  return defaultState
}

function nextLargerScale(current: TextScale): TextScale {
  switch (current) {
    case 'default':
      return 'large'
    case 'large':
      return 'xl'
    case 'xl':
      return 'xl'
    default:
      return assertNever(current)
  }
}

function nextSmallerScale(current: TextScale): TextScale {
  switch (current) {
    case 'xl':
      return 'large'
    case 'large':
      return 'default'
    case 'default':
      return 'default'
    default:
      return assertNever(current)
  }
}

export const useAccessibilityStore = defineStore(
  'accessibility',
  (): UseAccessibilityStoreReturn => {
    const initial = readPersistedState()
    const textScale = ref<TextScale>(initial.textScale)
    const highContrast = ref<boolean>(initial.highContrast)
    const largeControls = ref<boolean>(initial.largeControls)
    const underlineLinks = ref<boolean>(initial.underlineLinks)
    const plainReading = ref<boolean>(initial.plainReading)

    function persist(): void {
      if (typeof window === 'undefined') {
        return
      }
      const snapshot: AccessibilityState = {
        textScale: textScale.value,
        highContrast: highContrast.value,
        largeControls: largeControls.value,
        underlineLinks: underlineLinks.value,
        plainReading: plainReading.value,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    }

    function increaseTextScale(): void {
      textScale.value = nextLargerScale(textScale.value)
      persist()
    }

    function decreaseTextScale(): void {
      textScale.value = nextSmallerScale(textScale.value)
      persist()
    }

    function toggleHighContrast(): void {
      highContrast.value = !highContrast.value
      persist()
    }

    function toggleLargeControls(): void {
      largeControls.value = !largeControls.value
      persist()
    }

    function toggleUnderlineLinks(): void {
      underlineLinks.value = !underlineLinks.value
      persist()
    }

    function togglePlainReading(): void {
      plainReading.value = !plainReading.value
      persist()
    }

    return {
      textScale,
      highContrast,
      largeControls,
      underlineLinks,
      plainReading,
      increaseTextScale,
      decreaseTextScale,
      toggleHighContrast,
      toggleLargeControls,
      toggleUnderlineLinks,
      togglePlainReading,
    }
  },
)
