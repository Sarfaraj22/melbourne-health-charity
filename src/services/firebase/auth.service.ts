import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/services/firebase/config'
import type { AuthError, AuthResult, Role } from '@/types/auth'

function toAuthError(error: unknown): AuthError {
  if (error instanceof Error) {
    const code = 'code' in error && typeof error.code === 'string' ? error.code : 'auth/unknown'
    return { code, message: error.message }
  }
  return { code: 'auth/unknown', message: 'An unexpected error occurred.' }
}

function safeDisplayName(user: User): string {
  const name = user.displayName
  return name && name.length > 0 ? name : 'there'
}

export async function fetchUserRole(user: User): Promise<Role> {
  const token = await getIdTokenResult(user, true)
  const claim = token.claims['role']
  return claim === 'volunteer' || claim === 'admin' ? claim : 'user'
}

export interface SignInResult extends AuthResult {
  readonly user?: User
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: credential.user }
  } catch (error) {
    return { success: false, error: toAuthError(error) }
  }
}

export async function register(
  email: string,
  password: string,
  displayName: string,
): Promise<SignInResult> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName.length > 0) {
      await credential.user.updateProfile({ displayName })
    }
    return { success: true, user: credential.user }
  } catch (error) {
    return { success: false, error: toAuthError(error) }
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error) }
  }
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error) }
  }
}

export { safeDisplayName }
