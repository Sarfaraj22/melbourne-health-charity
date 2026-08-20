import { computed, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  addLiveChatMessage,
  createLiveChat,
  findLatestOpenLiveChatForUser,
  subscribeLiveChat,
  subscribeLiveChatMessages,
  type WithId,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import type { LiveChatDoc, LiveChatMessageDoc, LiveChatSender } from '@/types/firestore'
import type { Role } from '@/types/auth'

const SESSION_KEY = 'mhc-live-chat-id'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LiveChatPhase = 'start' | 'thread'
export type LiveChatEntry = 'public' | 'user-dashboard'

export interface UseLiveChatReturn {
  readonly phase: Ref<LiveChatPhase>
  readonly guestName: Ref<string>
  readonly guestEmail: Ref<string>
  readonly draft: Ref<string>
  readonly chat: Ref<WithId<LiveChatDoc> | undefined>
  readonly messages: Ref<readonly WithId<LiveChatMessageDoc>[]>
  readonly startError: Ref<string>
  readonly sendError: Ref<string>
  readonly starting: Ref<boolean>
  readonly sending: Ref<boolean>
  readonly staffRedirect: ComputedRef<string>
  readonly skipIdentityForm: ComputedRef<boolean>
  readonly authReady: ComputedRef<boolean>
  startChat: () => Promise<void>
  sendMessage: () => Promise<void>
  cancelStart: () => void
  leaveThread: () => void
}

function readSessionId(): string {
  try {
    return sessionStorage.getItem(SESSION_KEY) ?? ''
  } catch {
    return ''
  }
}

function writeSessionId(id: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, id)
  } catch {
    return
  }
}

function firebaseErrorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return ''
  }
  const code = Reflect.get(error, 'code')
  return typeof code === 'string' ? code : ''
}

function liveChatFailureMessage(error: unknown, action: 'start' | 'send'): string {
  const code = firebaseErrorCode(error)
  if (code.includes('permission-denied')) {
    return action === 'start'
      ? 'Unable to start live chat (permission denied). Firestore rules may not be deployed yet.'
      : 'Unable to send your message (permission denied). Firestore rules may not be deployed yet.'
  }
  return action === 'start'
    ? 'Unable to start live chat right now. Please try again later.'
    : 'Unable to send your message. Please try again.'
}

function staffHome(role: Role | undefined): string {
  if (role === 'volunteer') {
    return '/volunteer/portal'
  }
  if (role === 'admin') {
    return '/admin/dashboard'
  }
  return ''
}

export function isCustomerLiveChatSender(sender: LiveChatSender): boolean {
  return sender === 'visitor' || sender === 'user'
}

export function useLiveChat(entry: LiveChatEntry): UseLiveChatReturn {
  const authStore = useAuthStore()
  const phase = ref<LiveChatPhase>('start')
  const guestName = ref<string>('')
  const guestEmail = ref<string>('')
  const draft = ref<string>('')
  const chat = ref<WithId<LiveChatDoc> | undefined>(undefined)
  const messages = ref<readonly WithId<LiveChatMessageDoc>[]>([])
  const startError = ref<string>('')
  const sendError = ref<string>('')
  const starting = ref<boolean>(false)
  const sending = ref<boolean>(false)
  const chatId = ref<string>('')
  const viewDismissed = ref<boolean>(false)

  let unsubChat: (() => void) | undefined
  let unsubMessages: (() => void) | undefined

  const authReady = computed<boolean>(() => authStore.authState.status !== 'loading')
  const skipIdentityForm = computed<boolean>(() => {
    if (authStore.user === undefined) {
      return false
    }
    if (entry === 'user-dashboard') {
      return true
    }
    return authStore.role === 'user'
  })
  const staffRedirect = computed<string>(() => {
    if (entry !== 'public') {
      return ''
    }
    return staffHome(authStore.role)
  })

  function clearSubscriptions(): void {
    if (unsubChat !== undefined) {
      unsubChat()
      unsubChat = undefined
    }
    if (unsubMessages !== undefined) {
      unsubMessages()
      unsubMessages = undefined
    }
  }

  function attach(id: string): void {
    clearSubscriptions()
    unsubChat = subscribeLiveChat(id, (record) => {
      chat.value = record
      if (record === undefined) {
        phase.value = 'start'
        return
      }
      guestName.value = record.data.guestName
      guestEmail.value = record.data.guestEmail
      phase.value = 'thread'
    })
    unsubMessages = subscribeLiveChatMessages(id, (records) => {
      messages.value = records
        .slice()
        .sort((left, right) => left.data.createdAt - right.data.createdAt)
    })
  }

  watch(
    chatId,
    (id) => {
      if (id.length === 0) {
        clearSubscriptions()
        phase.value = 'start'
        return
      }
      attach(id)
    },
    { immediate: true, deep: false },
  )

  watch(
    () => [authStore.authState.status, authStore.role, authStore.user?.uid] as const,
    () => {
      if (authStore.authState.status === 'loading') {
        return
      }
      if (staffRedirect.value.length > 0) {
        chatId.value = ''
        return
      }
      if (viewDismissed.value) {
        return
      }
      if (skipIdentityForm.value) {
        const uid = authStore.user?.uid
        if (uid === undefined) {
          return
        }
        void findLatestOpenLiveChatForUser(uid).then((existingId) => {
          if (viewDismissed.value || existingId === undefined) {
            return
          }
          chatId.value = existingId
        })
        return
      }
      const sessionId = readSessionId()
      if (sessionId.length > 0 && chatId.value.length === 0) {
        chatId.value = sessionId
      }
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    clearSubscriptions()
  })

  function cancelStart(): void {
    guestName.value = ''
    guestEmail.value = ''
    startError.value = ''
  }

  function leaveThread(): void {
    viewDismissed.value = true
    draft.value = ''
    sendError.value = ''
    chat.value = undefined
    messages.value = []
    chatId.value = ''
    phase.value = 'start'
  }

  async function startChat(): Promise<void> {
    viewDismissed.value = false
    startError.value = ''
    if (staffRedirect.value.length > 0) {
      return
    }
    starting.value = true
    try {
      if (skipIdentityForm.value) {
        const user = authStore.user
        if (user === undefined) {
          startError.value =
            entry === 'public'
              ? 'Please enter your name and a valid email address.'
              : 'You need to be signed in to start live chat.'
          return
        }
        const existingId = await findLatestOpenLiveChatForUser(user.uid)
        if (existingId !== undefined) {
          chatId.value = existingId
          phase.value = 'thread'
          return
        }
        const id = await createLiveChat({
          guestName: user.displayName,
          guestEmail: user.email,
          origin: 'registered',
          userId: user.uid,
          status: 'open',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        chatId.value = id
        phase.value = 'thread'
        return
      }
      const name = guestName.value.trim()
      const email = guestEmail.value.trim()
      if (name.length === 0 || !emailPattern.test(email)) {
        startError.value = 'Please enter your name and a valid email address.'
        return
      }
      const id = await createLiveChat({
        guestName: name,
        guestEmail: email,
        origin: 'visitor',
        userId: '',
        status: 'open',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      writeSessionId(id)
      chatId.value = id
      phase.value = 'thread'
    } catch (error) {
      startError.value = liveChatFailureMessage(error, 'start')
    } finally {
      starting.value = false
    }
  }

  async function sendMessage(): Promise<void> {
    sendError.value = ''
    const id = chatId.value
    const body = draft.value.trim()
    const user = authStore.user
    if (id.length === 0 || body.length === 0) {
      return
    }
    const sender: LiveChatSender = skipIdentityForm.value && user !== undefined ? 'user' : 'visitor'
    sending.value = true
    try {
      await addLiveChatMessage(id, {
        sender,
        body,
        createdAt: Date.now(),
      })
      draft.value = ''
    } catch (error) {
      sendError.value = liveChatFailureMessage(error, 'send')
    } finally {
      sending.value = false
    }
  }

  return {
    phase,
    guestName,
    guestEmail,
    draft,
    chat,
    messages,
    startError,
    sendError,
    starting,
    sending,
    staffRedirect,
    skipIdentityForm,
    authReady,
    startChat,
    sendMessage,
    cancelStart,
    leaveThread,
  }
}
