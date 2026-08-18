import { onUnmounted, ref, watch, type Ref } from 'vue'
import {
  addLiveChatMessage,
  createLiveChat,
  subscribeLiveChat,
  subscribeLiveChatMessages,
  type WithId,
} from '@/services/firebase/firestore.service'
import type { LiveChatDoc, LiveChatMessageDoc } from '@/types/firestore'

const SESSION_KEY = 'mhc-live-chat-id'

export type LiveChatPhase = 'start' | 'thread'

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
  startChat: () => Promise<void>
  sendMessage: () => Promise<void>
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export function useLiveChat(): UseLiveChatReturn {
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
  const chatId = ref<string>(readSessionId())

  let unsubChat: (() => void) | undefined
  let unsubMessages: (() => void) | undefined

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

  onUnmounted(() => {
    clearSubscriptions()
  })

  async function startChat(): Promise<void> {
    startError.value = ''
    const name = guestName.value.trim()
    const email = guestEmail.value.trim()
    if (name.length === 0 || !emailPattern.test(email)) {
      startError.value = 'Please enter your name and a valid email address.'
      return
    }
    starting.value = true
    try {
      const id = await createLiveChat({
        guestName: name,
        guestEmail: email,
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
    if (id.length === 0 || body.length === 0) {
      return
    }
    sending.value = true
    try {
      await addLiveChatMessage(id, {
        sender: 'guest',
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
    startChat,
    sendMessage,
  }
}
