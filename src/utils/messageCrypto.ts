const CIPHER_PREFIX = 'mhc1.'
const KEY_SALT = 'mhc-inbox-v1:'
const IV_LENGTH = 12

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 1) {
    const code = bytes[index]
    if (code === undefined) {
      continue
    }
    binary += String.fromCharCode(code)
  }
  return btoa(binary)
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function inboxAesKey(userId: string): Promise<CryptoKey> {
  const material = new TextEncoder().encode(`${KEY_SALT}${userId}`)
  const digest = await crypto.subtle.digest('SHA-256', material)
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export function isInboxCiphertext(value: string): boolean {
  return value.startsWith(CIPHER_PREFIX)
}

export async function encryptInboxBody(userId: string, plaintext: string): Promise<string> {
  const key = await inboxAesKey(userId)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoded = new TextEncoder().encode(plaintext)
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const packed = new Uint8Array(iv.length + cipherBuf.byteLength)
  packed.set(iv, 0)
  packed.set(new Uint8Array(cipherBuf), iv.length)
  return `${CIPHER_PREFIX}${bytesToBase64(packed)}`
}

export async function decryptInboxBody(userId: string, stored: string): Promise<string> {
  if (!isInboxCiphertext(stored)) {
    return stored
  }
  try {
    const packed = base64ToBytes(stored.slice(CIPHER_PREFIX.length))
    if (packed.length <= IV_LENGTH) {
      return stored
    }
    const iv = packed.slice(0, IV_LENGTH)
    const data = packed.slice(IV_LENGTH)
    const key = await inboxAesKey(userId)
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return new TextDecoder().decode(plainBuf)
  } catch {
    return stored
  }
}
