function readEnv(key: string): string {
  const value = process.env[key]
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export function resendApiKey(): string {
  return readEnv('RESEND_API_KEY')
}

export function resendFrom(): string {
  return readEnv('RESEND_FROM')
}

export function publicAppUrl(): string {
  return readEnv('PUBLIC_APP_URL').replace(/\/$/, '')
}
