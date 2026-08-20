import { computed, nextTick, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  addThreadMessage,
  findOrCreateMessageThread,
  getProfile,
  listThreadMessages,
  subscribeAllMessageThreads,
  subscribeMessageThreadsForUser,
  subscribeProfiles,
  subscribeThreadMessages,
  type WithId,
} from '@/services/firebase/firestore.service'
import { useAuthStore } from '@/stores/auth.store'
import type { MessageThreadDoc, ProfileDoc, ThreadMessageDoc } from '@/types/firestore'

export interface MessageThreadListItem {
  readonly id: string
  readonly counterpartUid: string
  readonly counterpartName: string
  readonly updatedAt: number
  readonly lastInboundSender: string
  readonly lastInboundPreview: string
}

export interface UseMessageThreadsReturn {
  readonly threads: ComputedRef<readonly MessageThreadListItem[]>
  readonly inboundRows: ComputedRef<readonly MessageThreadListItem[]>
  readonly selectedId: Ref<string>
  readonly messages: Ref<readonly WithId<ThreadMessageDoc>[]>
  readonly draft: Ref<string>
  readonly sending: Ref<boolean>
  readonly sendError: Ref<string>
  readonly composeError: Ref<string>
  readonly listError: Ref<string>
  readonly selfUid: ComputedRef<string>
  selectThread: (threadId: string) => void
  sendReply: () => Promise<void>
  startThreadWith: (otherUid: string, openingBody?: string) => Promise<string | undefined>
}

interface ThreadPreview {
  readonly sender: string
  readonly senderUid: string
  readonly body: string
}

function counterpartUid(thread: MessageThreadDoc, selfUid: string): string {
  const match = thread.participantUids.find((uid) => uid !== selfUid)
  return match === undefined ? '' : match
}

function previewText(body: string): string {
  const trimmed = body.trim()
  if (trimmed.length <= 80) {
    return trimmed
  }
  return `${trimmed.slice(0, 77)}...`
}

export function useMessageThreads(mode: 'self' | 'admin'): UseMessageThreadsReturn {
  const authStore = useAuthStore()
  const threadRecords = ref<readonly WithId<MessageThreadDoc>[]>([])
  const profiles = ref<readonly WithId<ProfileDoc>[]>([])
  const nameByUid = ref<Readonly<Record<string, string>>>({})
  const previewByThreadId = ref<Readonly<Record<string, ThreadPreview>>>({})
  const selectedId = ref<string>('')
  const messages = ref<readonly WithId<ThreadMessageDoc>[]>([])
  const draft = ref<string>('')
  const sending = ref<boolean>(false)
  const sendError = ref<string>('')
  const composeError = ref<string>('')
  const listError = ref<string>('')

  let unsubThreads: (() => void) | undefined
  let unsubProfiles: (() => void) | undefined
  let unsubMessages: (() => void) | undefined
  let previewGeneration = 0

  const selfUid = computed<string>(() => authStore.user?.uid ?? '')

  const threads = computed<readonly MessageThreadListItem[]>(() =>
    threadRecords.value
      .slice()
      .sort((left, right) => right.data.updatedAt - left.data.updatedAt)
      .map((record) => {
        const otherUid = counterpartUid(record.data, selfUid.value)
        const fromProfile = profiles.value.find((profile) => profile.data.uid === otherUid)
        const cached = nameByUid.value[otherUid]
        const counterpartName =
          fromProfile === undefined ? (cached ?? 'Member') : fromProfile.data.displayName
        const preview = previewByThreadId.value[record.id]
        return {
          id: record.id,
          counterpartUid: otherUid,
          counterpartName,
          updatedAt: record.data.updatedAt,
          lastInboundSender: preview === undefined ? counterpartName : preview.sender,
          lastInboundPreview: preview === undefined ? '' : previewText(preview.body),
        }
      }),
  )

  const inboundRows = computed<readonly MessageThreadListItem[]>(() =>
    threads.value.filter((thread) => {
      const preview = previewByThreadId.value[thread.id]
      if (preview === undefined) {
        return false
      }
      return preview.senderUid !== selfUid.value
    }),
  )

  function clearMessageSubscription(): void {
    if (unsubMessages !== undefined) {
      unsubMessages()
      unsubMessages = undefined
    }
  }

  function attachMessages(threadId: string): void {
    clearMessageSubscription()
    messages.value = []
    if (threadId.length === 0) {
      return
    }
    unsubMessages = subscribeThreadMessages(threadId, (records) => {
      messages.value = records
        .slice()
        .sort((left, right) => left.data.createdAt - right.data.createdAt)
    })
  }

  watch(
    selectedId,
    (threadId) => {
      attachMessages(threadId)
    },
    { immediate: true, deep: false },
  )

  watch(
    () => authStore.user?.uid,
    (uid) => {
      if (unsubThreads !== undefined) {
        unsubThreads()
        unsubThreads = undefined
      }
      if (unsubProfiles !== undefined) {
        unsubProfiles()
        unsubProfiles = undefined
      }
      threadRecords.value = []
      selectedId.value = ''
      listError.value = ''
      previewByThreadId.value = {}
      if (uid === undefined) {
        return
      }
      const onListError = (error: Error): void => {
        listError.value = error.message.length > 0 ? error.message : 'Unable to load conversations.'
      }
      if (mode === 'admin') {
        unsubThreads = subscribeAllMessageThreads((records) => {
          listError.value = ''
          threadRecords.value = records
        }, onListError)
        unsubProfiles = subscribeProfiles((records) => {
          profiles.value = records
        })
        return
      }
      unsubThreads = subscribeMessageThreadsForUser(
        uid,
        (records) => {
          listError.value = ''
          threadRecords.value = records
        },
        onListError,
      )
    },
    { immediate: true, deep: false },
  )

  watch(
    threadRecords,
    (records) => {
      const uid = selfUid.value
      if (uid.length === 0) {
        return
      }
      const missing = new Set<string>()
      for (const record of records) {
        const otherUid = counterpartUid(record.data, uid)
        if (otherUid.length === 0) {
          continue
        }
        const knownProfile = profiles.value.some((profile) => profile.data.uid === otherUid)
        if (!knownProfile && nameByUid.value[otherUid] === undefined) {
          missing.add(otherUid)
        }
      }
      for (const otherUid of missing) {
        void getProfile(otherUid).then((profile) => {
          const name = profile === undefined ? 'Member' : profile.data.displayName
          nameByUid.value = { ...nameByUid.value, [otherUid]: name }
        })
      }

      previewGeneration += 1
      const current = previewGeneration
      void Promise.all(
        records.map(
          async (
            record,
          ): Promise<{
            readonly id: string
            readonly preview: ThreadPreview | undefined
          }> => {
            try {
              const threadMessages = await listThreadMessages(record.id)
              const inbound = threadMessages
                .slice()
                .sort((left, right) => right.data.createdAt - left.data.createdAt)
                .find((message) => message.data.senderUid !== uid)
              const latest = inbound ?? threadMessages[threadMessages.length - 1]
              return {
                id: record.id,
                preview:
                  latest === undefined
                    ? undefined
                    : {
                        sender: latest.data.sender,
                        senderUid: latest.data.senderUid,
                        body: latest.data.body,
                      },
              }
            } catch {
              return { id: record.id, preview: undefined }
            }
          },
        ),
      ).then((results) => {
        if (current !== previewGeneration) {
          return
        }
        const next: Record<string, ThreadPreview> = {}
        for (const result of results) {
          if (result.preview !== undefined) {
            next[result.id] = result.preview
          }
        }
        previewByThreadId.value = next
      })
    },
    { immediate: true, deep: false },
  )

  onUnmounted(() => {
    if (unsubThreads !== undefined) {
      unsubThreads()
    }
    if (unsubProfiles !== undefined) {
      unsubProfiles()
    }
    clearMessageSubscription()
  })

  function selectThread(threadId: string): void {
    selectedId.value = threadId
    sendError.value = ''
    composeError.value = ''
  }

  async function sendReply(): Promise<void> {
    sendError.value = ''
    const user = authStore.user
    const threadId = selectedId.value
    const body = draft.value.trim()
    if (user === undefined || threadId.length === 0 || body.length === 0) {
      return
    }
    sending.value = true
    try {
      await addThreadMessage(threadId, {
        senderUid: user.uid,
        sender: user.displayName,
        fromRole: user.role,
        body,
        createdAt: Date.now(),
      })
      draft.value = ''
    } catch (error) {
      sendError.value =
        error instanceof Error && error.message.length > 0
          ? error.message
          : 'Unable to send your reply.'
    } finally {
      sending.value = false
    }
  }

  async function startThreadWith(
    otherUid: string,
    openingBody?: string,
  ): Promise<string | undefined> {
    composeError.value = ''
    const user = authStore.user
    if (user === undefined || otherUid.length === 0) {
      composeError.value = 'You need to be signed in to start a conversation.'
      return undefined
    }
    const existing = threadRecords.value.find((record) =>
      record.data.participantUids.includes(otherUid),
    )
    if (existing !== undefined) {
      selectedId.value = existing.id
      await nextTick()
      return existing.id
    }
    try {
      const threadId = await findOrCreateMessageThread(user.uid, otherUid, user.uid)
      selectedId.value = threadId
      const body = openingBody === undefined ? '' : openingBody.trim()
      if (body.length > 0) {
        await addThreadMessage(threadId, {
          senderUid: user.uid,
          sender: user.displayName,
          fromRole: user.role,
          body,
          createdAt: Date.now(),
        })
      }
      return threadId
    } catch (error) {
      composeError.value =
        error instanceof Error && error.message.length > 0
          ? error.message
          : 'Unable to start this conversation.'
      return undefined
    }
  }

  return {
    threads,
    inboundRows,
    selectedId,
    messages,
    draft,
    sending,
    sendError,
    composeError,
    listError,
    selfUid,
    selectThread,
    sendReply,
    startThreadWith,
  }
}
