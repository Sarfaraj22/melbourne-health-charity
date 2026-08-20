import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { EmailAttachmentPayload } from '@/types/functions'

export const EMAIL_ATTACHMENT_MAX_FILES = 3
export const EMAIL_ATTACHMENT_MAX_BYTES = 4 * 1024 * 1024

const ALLOWED_TYPES: ReadonlySet<string> = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export interface UseEmailAttachmentsReturn {
  readonly files: Ref<readonly File[]>
  readonly errorMessage: Ref<string>
  readonly accept: string
  readonly hint: ComputedRef<string>
  addFiles: (list: FileList | null) => void
  removeFile: (index: number) => void
  clear: () => void
  toPayload: () => Promise<readonly EmailAttachmentPayload[]>
}

function mimeForFile(file: File): string | undefined {
  if (ALLOWED_TYPES.has(file.type)) {
    return file.type
  }
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) {
    return 'application/pdf'
  }
  if (name.endsWith('.png')) {
    return 'image/png'
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return 'image/jpeg'
  }
  if (name.endsWith('.txt')) {
    return 'text/plain'
  }
  if (name.endsWith('.doc')) {
    return 'application/msword'
  }
  if (name.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  return undefined
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (): void => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Unable to read this file.'))
        return
      }
      const comma = result.indexOf(',')
      resolve(comma === -1 ? result : result.slice(comma + 1))
    }
    reader.onerror = (): void => {
      reject(new Error('Unable to read this file.'))
    }
    reader.readAsDataURL(file)
  })
}

export function useEmailAttachments(): UseEmailAttachmentsReturn {
  const files = ref<readonly File[]>([])
  const errorMessage = ref<string>('')

  const hint = computed<string>(() => {
    return 'PDF, Word, text, PNG, or JPEG. Up to 3 files, 4 MB total.'
  })

  function addFiles(list: FileList | null): void {
    errorMessage.value = ''
    if (list === null) {
      return
    }
    const next = [...files.value]
    for (const file of Array.from(list)) {
      if (mimeForFile(file) === undefined) {
        errorMessage.value = 'Attachments must be PDF, Word, text, PNG, or JPEG files.'
        continue
      }
      next.push(file)
    }
    if (next.length > EMAIL_ATTACHMENT_MAX_FILES) {
      errorMessage.value = 'You can attach up to 3 files.'
      files.value = next.slice(0, EMAIL_ATTACHMENT_MAX_FILES)
      return
    }
    const total = next.reduce((sum, file) => sum + file.size, 0)
    if (total > EMAIL_ATTACHMENT_MAX_BYTES) {
      errorMessage.value = 'Attachments must be 4 MB or smaller in total.'
      return
    }
    files.value = next
  }

  function removeFile(index: number): void {
    errorMessage.value = ''
    files.value = files.value.slice(0, index).concat(files.value.slice(index + 1))
  }

  function clear(): void {
    files.value = []
    errorMessage.value = ''
  }

  async function toPayload(): Promise<readonly EmailAttachmentPayload[]> {
    const payload: EmailAttachmentPayload[] = []
    for (const file of files.value) {
      const contentType = mimeForFile(file)
      if (contentType === undefined) {
        throw new Error('Attachments must be PDF, Word, text, PNG, or JPEG files.')
      }
      const contentBase64 = await readFileAsBase64(file)
      payload.push({
        filename: file.name,
        contentType,
        contentBase64,
      })
    }
    return payload
  }

  return {
    files,
    errorMessage,
    accept: '.pdf,.png,.jpg,.jpeg,.txt,.doc,.docx',
    hint,
    addFiles,
    removeFile,
    clear,
    toPayload,
  }
}
