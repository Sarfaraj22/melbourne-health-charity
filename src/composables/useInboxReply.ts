import { ref, type Ref } from 'vue'
import { createInboxMessage } from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import type { MessageFromRole } from '@/types/firestore'

export interface UseInboxReplyReturn {
  readonly draft: Ref<string>
  readonly status: Ref<'idle' | 'submitting' | 'success' | 'error'>
  readonly errorMessage: Ref<string>
  send: () => Promise<boolean>
}

export function useInboxReply(fromRole: MessageFromRole): UseInboxReplyReturn {
  const authStore = useAuthStore()
  const draft = ref<string>('')
  const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const errorMessage = ref<string>('')

  async function send(): Promise<boolean> {
    status.value = 'submitting'
    errorMessage.value = ''
    const user = authStore.user
    const body = draft.value.trim()
    if (user === undefined) {
      status.value = 'error'
      errorMessage.value = 'You need to be signed in to reply.'
      return false
    }
    if (body.length === 0) {
      status.value = 'error'
      errorMessage.value = 'Please enter a message.'
      return false
    }
    try {
      await createInboxMessage({
        userId: user.uid,
        sender: user.displayName,
        body,
        fromRole,
        createdAt: Date.now(),
      })
      draft.value = ''
      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      errorMessage.value = 'Unable to send your reply.'
      return false
    }
  }

  return { draft, status, errorMessage, send }
}
