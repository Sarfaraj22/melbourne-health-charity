import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getIdTokenResult,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateEmail,
  updatePassword,
  type User,
} from 'firebase/auth'
import { auth } from '@/services/firebase/config'
import { requestPasswordReset } from '@/services/firebase/functions.service'
import { upsertProfile } from '@/services/firebase/firestore.service'
import type { AuthError, AuthResult, Role } from '@/types/auth'

type AuthErrorContext = 'signIn' | 'register' | 'passwordReset' | 'generic'

const GENERIC_AUTH_MESSAGE = 'Something went wrong. Please try again.'
const CREDENTIAL_MESSAGE = 'The email or password is incorrect.'
const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.'
const EMAIL_IN_USE_MESSAGE = 'An account with this email already exists.'
const WEAK_PASSWORD_MESSAGE = 'Please choose a stronger password.'
const TOO_MANY_REQUESTS_MESSAGE = 'Too many attempts. Please wait a moment and try again.'
const RESET_NOT_FOUND_MESSAGE = 'We could not find an account with that email address.'

function errorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return 'auth/unknown'
  }
  const code = Reflect.get(error, 'code')
  return typeof code === 'string' ? code : 'auth/unknown'
}

function mappedAuthError(code: string, context: AuthErrorContext): AuthError {
  if (code === 'auth/invalid-email' || code === 'auth/missing-email') {
    return { code, message: INVALID_EMAIL_MESSAGE, field: 'email' }
  }

  if (code === 'auth/too-many-requests') {
    return { code, message: TOO_MANY_REQUESTS_MESSAGE }
  }

  if (context === 'passwordReset') {
    if (code === 'auth/user-not-found' || code === 'functions/not-found' || code === 'not-found') {
      return { code, message: RESET_NOT_FOUND_MESSAGE, field: 'email' }
    }
    if (code === 'functions/invalid-argument') {
      return { code, message: INVALID_EMAIL_MESSAGE, field: 'email' }
    }
    return { code, message: GENERIC_AUTH_MESSAGE }
  }

  if (
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential' ||
    code === 'auth/invalid-login-credentials'
  ) {
    return { code, message: CREDENTIAL_MESSAGE, field: 'password' }
  }

  if (code === 'auth/email-already-in-use') {
    return { code, message: EMAIL_IN_USE_MESSAGE, field: 'email' }
  }

  if (code === 'auth/weak-password') {
    return { code, message: WEAK_PASSWORD_MESSAGE, field: 'password' }
  }

  return { code, message: GENERIC_AUTH_MESSAGE }
}

function toAuthError(error: unknown, context: AuthErrorContext): AuthError {
  return mappedAuthError(errorCode(error), context)
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
    return { success: false, error: toAuthError(error, 'signIn') }
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
    await upsertProfile({
      uid: credential.user.uid,
      displayName: displayName.length > 0 ? displayName : safeDisplayName(credential.user),
      email: credential.user.email ?? email,
      role: 'user',
      createdAt: Date.now(),
      disabled: false,
    })
    return { success: true, user: credential.user }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'register') }
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'generic') }
  }
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await requestPasswordReset({ email })
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'passwordReset') }
  }
}

async function reauthenticateCurrentUser(password: string): Promise<AuthResult> {
  const user = auth.currentUser
  if (user === null || user.email === null) {
    return {
      success: false,
      error: { code: 'auth/unauthenticated', message: 'Please sign in again to continue.' },
    }
  }
  try {
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'signIn') }
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<AuthResult> {
  const reauth = await reauthenticateCurrentUser(currentPassword)
  if (!reauth.success) {
    return reauth
  }
  const user = auth.currentUser
  if (user === null) {
    return {
      success: false,
      error: { code: 'auth/unauthenticated', message: 'Please sign in again to continue.' },
    }
  }
  try {
    await updatePassword(user, newPassword)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'generic') }
  }
}

export async function changeEmail(currentPassword: string, newEmail: string): Promise<AuthResult> {
  const reauth = await reauthenticateCurrentUser(currentPassword)
  if (!reauth.success) {
    return reauth
  }
  const user = auth.currentUser
  if (user === null) {
    return {
      success: false,
      error: { code: 'auth/unauthenticated', message: 'Please sign in again to continue.' },
    }
  }
  try {
    await updateEmail(user, newEmail)
    const { updateProfileEmail } = await import('@/services/firebase/firestore.service')
    await updateProfileEmail(user.uid, newEmail)
    return { success: true }
  } catch (error) {
    return { success: false, error: toAuthError(error, 'generic') }
  }
}

export { safeDisplayName }
