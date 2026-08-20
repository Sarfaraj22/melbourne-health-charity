import { ref, type Ref } from 'vue'
import { changeEmail, changePassword } from '@/services/firebase/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResult } from '@/types/auth'

export interface ProfileEmailErrors {
  readonly email?: string
  readonly password?: string
}

export interface ProfilePasswordErrors {
  readonly currentPassword?: string
  readonly newPassword?: string
  readonly confirmPassword?: string
}

export interface UseProfileSecurityReturn {
  readonly emailValue: Ref<string>
  readonly emailPassword: Ref<string>
  readonly emailErrors: Ref<ProfileEmailErrors>
  readonly emailStatus: Ref<'idle' | 'submitting' | 'success' | 'error'>
  readonly emailMessage: Ref<string>
  readonly emailEditing: Ref<boolean>
  readonly currentPassword: Ref<string>
  readonly newPassword: Ref<string>
  readonly confirmPassword: Ref<string>
  readonly passwordErrors: Ref<ProfilePasswordErrors>
  readonly passwordStatus: Ref<'idle' | 'submitting' | 'success' | 'error'>
  readonly passwordMessage: Ref<string>
  startEmailEdit: () => void
  cancelEmailEdit: () => void
  setEmailValue: (value: string) => void
  setEmailPassword: (value: string) => void
  submitEmail: () => Promise<boolean>
  setCurrentPassword: (value: string) => void
  setNewPassword: (value: string) => void
  setConfirmPassword: (value: string) => void
  submitPassword: () => Promise<boolean>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function omitEmailField(
  source: ProfileEmailErrors,
  field: 'email' | 'password',
): ProfileEmailErrors {
  if (field === 'email') {
    return source.password === undefined ? {} : { password: source.password }
  }
  return source.email === undefined ? {} : { email: source.email }
}

function omitPasswordField(
  source: ProfilePasswordErrors,
  field: 'currentPassword' | 'newPassword' | 'confirmPassword',
): ProfilePasswordErrors {
  const current =
    field === 'currentPassword' || source.currentPassword === undefined
      ? {}
      : { currentPassword: source.currentPassword }
  const nextNew =
    field === 'newPassword' || source.newPassword === undefined
      ? {}
      : { newPassword: source.newPassword }
  const confirm =
    field === 'confirmPassword' || source.confirmPassword === undefined
      ? {}
      : { confirmPassword: source.confirmPassword }
  return { ...current, ...nextNew, ...confirm }
}

export function useProfileSecurity(): UseProfileSecurityReturn {
  const authStore = useAuthStore()
  const emailValue = ref<string>(authStore.user?.email ?? '')
  const emailPassword = ref<string>('')
  const emailErrors = ref<ProfileEmailErrors>({})
  const emailStatus = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const emailMessage = ref<string>('')
  const emailEditing = ref<boolean>(false)

  const currentPassword = ref<string>('')
  const newPassword = ref<string>('')
  const confirmPassword = ref<string>('')
  const passwordErrors = ref<ProfilePasswordErrors>({})
  const passwordStatus = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const passwordMessage = ref<string>('')

  function startEmailEdit(): void {
    emailValue.value = authStore.user?.email ?? ''
    emailPassword.value = ''
    emailErrors.value = {}
    emailStatus.value = 'idle'
    emailMessage.value = ''
    emailEditing.value = true
  }

  function cancelEmailEdit(): void {
    emailEditing.value = false
    emailPassword.value = ''
    emailErrors.value = {}
    emailStatus.value = 'idle'
    emailMessage.value = ''
    emailValue.value = authStore.user?.email ?? ''
  }

  function setEmailValue(value: string): void {
    emailValue.value = value
    if (emailErrors.value.email !== undefined) {
      emailErrors.value = omitEmailField(emailErrors.value, 'email')
    }
  }

  function setEmailPassword(value: string): void {
    emailPassword.value = value
    if (emailErrors.value.password !== undefined) {
      emailErrors.value = omitEmailField(emailErrors.value, 'password')
    }
  }

  async function submitEmail(): Promise<boolean> {
    const errors: ProfileEmailErrors = {}
    const nextEmail = emailValue.value.trim()
    if (nextEmail.length === 0 || !emailPattern.test(nextEmail)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (emailPassword.value.length === 0) {
      errors.password = 'Please enter your current password.'
    }
    emailErrors.value = errors
    if (Object.keys(errors).length > 0) {
      return false
    }
    emailStatus.value = 'submitting'
    emailMessage.value = ''
    const result: AuthResult = await changeEmail(emailPassword.value, nextEmail)
    if (!result.success) {
      emailStatus.value = 'error'
      emailMessage.value = result.error?.message ?? 'Unable to update your email.'
      if (result.error?.field === 'password') {
        emailErrors.value = { password: result.error.message }
      } else if (result.error?.field === 'email') {
        emailErrors.value = { email: result.error.message }
      }
      return false
    }
    await authStore.refreshUser()
    emailStatus.value = 'success'
    emailMessage.value = 'Your email has been updated.'
    emailEditing.value = false
    emailPassword.value = ''
    return true
  }

  function setCurrentPassword(value: string): void {
    currentPassword.value = value
    if (passwordErrors.value.currentPassword !== undefined) {
      passwordErrors.value = omitPasswordField(passwordErrors.value, 'currentPassword')
    }
  }

  function setNewPassword(value: string): void {
    newPassword.value = value
    if (passwordErrors.value.newPassword !== undefined) {
      passwordErrors.value = omitPasswordField(passwordErrors.value, 'newPassword')
    }
  }

  function setConfirmPassword(value: string): void {
    confirmPassword.value = value
    if (passwordErrors.value.confirmPassword !== undefined) {
      passwordErrors.value = omitPasswordField(passwordErrors.value, 'confirmPassword')
    }
  }

  async function submitPassword(): Promise<boolean> {
    const errors: ProfilePasswordErrors = {}
    if (currentPassword.value.length === 0) {
      errors.currentPassword = 'Please enter your current password.'
    }
    if (newPassword.value.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters.'
    }
    if (confirmPassword.value.length === 0) {
      errors.confirmPassword = 'Please confirm your new password.'
    } else if (newPassword.value !== confirmPassword.value) {
      errors.confirmPassword = 'Passwords do not match.'
    }
    passwordErrors.value = errors
    if (Object.keys(errors).length > 0) {
      return false
    }
    passwordStatus.value = 'submitting'
    passwordMessage.value = ''
    const result = await changePassword(currentPassword.value, newPassword.value)
    if (!result.success) {
      passwordStatus.value = 'error'
      passwordMessage.value = result.error?.message ?? 'Unable to update your password.'
      if (result.error?.field === 'password') {
        passwordErrors.value = { currentPassword: result.error.message }
      }
      return false
    }
    passwordStatus.value = 'success'
    passwordMessage.value = 'Your password has been updated.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    return true
  }

  return {
    emailValue,
    emailPassword,
    emailErrors,
    emailStatus,
    emailMessage,
    emailEditing,
    currentPassword,
    newPassword,
    confirmPassword,
    passwordErrors,
    passwordStatus,
    passwordMessage,
    startEmailEdit,
    cancelEmailEdit,
    setEmailValue,
    setEmailPassword,
    submitEmail,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    submitPassword,
  }
}
