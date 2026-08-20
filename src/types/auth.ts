import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    readonly title?: string
    readonly requiresAuth?: boolean
    readonly requiresGuest?: boolean
    readonly requiresRole?: readonly Role[]
    readonly expectedRole?: Role
  }
}

export type Role = 'user' | 'volunteer' | 'admin'

export interface AuthUser {
  readonly uid: string
  readonly email: string
  readonly displayName: string
  readonly role: Role
}

export type AuthErrorField = 'email' | 'password'

export interface AuthError {
  readonly code: string
  readonly message: string
  readonly field?: AuthErrorField
}

export type AuthState =
  | { readonly status: 'loading' }
  | { readonly status: 'authenticated'; readonly user: AuthUser }
  | { readonly status: 'unauthenticated' }
  | { readonly status: 'error'; readonly error: AuthError }

export type AuthStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface LoginFormState {
  readonly email: string
  readonly password: string
}

export interface LoginFormErrors {
  readonly email?: string
  readonly password?: string
}

export interface RegisterFormState {
  readonly name: string
  readonly email: string
  readonly password: string
  readonly confirmPassword: string
}

export interface RegisterFormErrors {
  readonly name?: string
  readonly email?: string
  readonly password?: string
  readonly confirmPassword?: string
}

export interface ForgotPasswordFormState {
  readonly email: string
}

export interface ForgotPasswordFormErrors {
  readonly email?: string
}

export interface AuthResult {
  readonly success: boolean
  readonly error?: AuthError
}

export function fieldErrorsFromAuthError(error: AuthError | undefined): {
  readonly email?: string
  readonly password?: string
} {
  if (error === undefined || error.field === undefined) {
    return {}
  }
  if (error.field === 'email') {
    return { email: error.message }
  }
  return { password: error.message }
}
