import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onAuthStateChanged, type Unsubscribe, type User } from 'firebase/auth'
import { auth } from '@/services/firebase/config'
import {
  fetchUserRole,
  register as registerService,
  safeDisplayName,
  sendPasswordReset as sendPasswordResetService,
  signIn as signInService,
  signOut as signOutService,
} from '@/services/firebase/auth.service'
import { assertNever } from '@/utils/assertNever'
import type { AuthError, AuthResult, AuthState, AuthUser, Role } from '@/types/auth'

export interface UseAuthStoreReturn {
  readonly authState: AuthState
  readonly isAuthenticated: boolean
  readonly user: AuthUser | undefined
  readonly role: Role | undefined
  readonly ready: Promise<void>
  roleHome: () => string
  setUser: (user: User) => Promise<void>
  clearUser: () => void
  signIn: (email: string, password: string) => Promise<AuthResult>
  register: (name: string, email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  sendPasswordReset: (email: string) => Promise<AuthResult>
  refreshUser: () => Promise<void>
}

function roleHomePath(role: Role): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'volunteer':
      return '/volunteer/portal'
    case 'user':
      return '/dashboard'
    default:
      return assertNever(role)
  }
}

let readyResolve: (() => void) | undefined
const readyPromise = new Promise<void>((resolve) => {
  readyResolve = resolve
})

export const useAuthStore = defineStore('auth', (): UseAuthStoreReturn => {
  const authState = ref<AuthState>({ status: 'loading' })

  const isAuthenticated = computed<boolean>(() => authState.value.status === 'authenticated')
  const user = computed<AuthUser | undefined>(() =>
    authState.value.status === 'authenticated' ? authState.value.user : undefined,
  )
  const role = computed<Role | undefined>(() => user.value?.role)

  function roleHome(): string {
    const currentRole = role.value
    return currentRole !== undefined ? roleHomePath(currentRole) : '/'
  }

  async function setUser(firebaseUser: User): Promise<void> {
    const nextRole = await fetchUserRole(firebaseUser)
    authState.value = {
      status: 'authenticated',
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: safeDisplayName(firebaseUser),
        role: nextRole,
      },
    }
  }

  function clearUser(): void {
    authState.value = { status: 'unauthenticated' }
  }

  function markError(error: AuthError): void {
    authState.value = { status: 'error', error }
  }

  async function signIn(email: string, password: string): Promise<AuthResult> {
    const result = await signInService(email, password)
    if (result.success && result.user !== undefined) {
      await setUser(result.user)
    } else if (!result.success && result.error !== undefined) {
      markError(result.error)
    }
    return result
  }

  async function register(name: string, email: string, password: string): Promise<AuthResult> {
    const result = await registerService(email, password, name)
    if (result.success && result.user !== undefined) {
      await setUser(result.user)
    } else if (!result.success && result.error !== undefined) {
      markError(result.error)
    }
    return result
  }

  async function signOut(): Promise<AuthResult> {
    const result = await signOutService()
    if (result.success) {
      clearUser()
    }
    return result
  }

  async function sendPasswordReset(email: string): Promise<AuthResult> {
    return sendPasswordResetService(email)
  }

  async function refreshUser(): Promise<void> {
    const firebaseUser = auth.currentUser
    if (firebaseUser === null) {
      clearUser()
      return
    }
    await setUser(firebaseUser)
  }

  return {
    authState,
    isAuthenticated,
    user,
    role,
    ready: readyPromise,
    roleHome,
    setUser,
    clearUser,
    signIn,
    register,
    signOut,
    sendPasswordReset,
    refreshUser,
  }
})

let listenerInitialised = false

export function initAuth(): Unsubscribe {
  if (listenerInitialised) {
    return () => undefined
  }
  listenerInitialised = true
  const store = useAuthStore()
  return onAuthStateChanged(
    auth,
    async (firebaseUser) => {
      if (firebaseUser === null) {
        store.clearUser()
      } else {
        try {
          await store.setUser(firebaseUser)
        } catch {
          store.clearUser()
        }
      }
      if (readyResolve !== undefined) {
        readyResolve()
        readyResolve = undefined
      }
    },
    (error) => {
      store.clearUser()
      if (readyResolve !== undefined) {
        readyResolve()
        readyResolve = undefined
      }
      // Surface a non-blocking error state without leaking credentials.
      store.authState = {
        status: 'error',
        error: { code: error.code, message: error.message },
      }
    },
  )
}
