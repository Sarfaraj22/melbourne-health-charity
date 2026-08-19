import { randomBytes } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getAuth, type UserRecord } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'
import { resendFrom } from './env.js'
import {
  declineEmailHtml,
  sendBulkBccEmail,
  sendHtmlEmail,
  sendPlainEmail,
  welcomeEmailHtml,
} from './mail.js'

initializeApp()
setGlobalOptions({ region: 'australia-southeast1' })

const auth = getAuth()
const db = getFirestore()

type ReviewDecision = 'approved' | 'denied'

interface ApplicationFields {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly status: string
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    throw new HttpsError('invalid-argument', 'Invalid request payload.')
  }
  const result: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value)) {
    result[key] = entry
  }
  return result
}

function readString(data: Record<string, unknown>, key: string): string {
  const value = data[key]
  return typeof value === 'string' ? value.trim() : ''
}

function readStringArray(data: Record<string, unknown>, key: string): readonly string[] {
  const value = data[key]
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

function requireAdmin(role: unknown): void {
  if (role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only administrators can perform this action.')
  }
}

function generatePassword(): string {
  return randomBytes(18).toString('base64url')
}

function parseApplication(data: Record<string, unknown>): ApplicationFields {
  return {
    name: readString(data, 'name'),
    email: readString(data, 'email'),
    phone: readString(data, 'phone'),
    address: readString(data, 'address'),
    status: readString(data, 'status'),
  }
}

function isReviewed(status: string): boolean {
  return status === 'approved' || status === 'denied'
}

export const reviewVolunteerApplication = onCall(
  { cors: true },
  async (request): Promise<{ readonly ok: true }> => {
    requireAdmin(request.auth?.token['role'])
    const payload = asRecord(request.data)
    const applicationId = readString(payload, 'applicationId')
    const decision = readString(payload, 'decision')
    if (applicationId.length === 0) {
      throw new HttpsError('invalid-argument', 'applicationId is required.')
    }
    if (decision !== 'approved' && decision !== 'denied') {
      throw new HttpsError('invalid-argument', 'decision must be approved or denied.')
    }
    const typedDecision: ReviewDecision = decision

    const appRef = db.collection('volunteer_applications').doc(applicationId)
    const snap = await appRef.get()
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Application not found.')
    }
    const application = parseApplication(asRecord(snap.data()))
    if (application.email.length === 0 || application.name.length === 0) {
      throw new HttpsError('failed-precondition', 'Application is missing name or email.')
    }
    if (isReviewed(application.status)) {
      throw new HttpsError('already-exists', 'This application has already been reviewed.')
    }

    if (typedDecision === 'denied') {
      await appRef.update({
        status: 'denied',
        reviewedAt: FieldValue.serverTimestamp(),
      })
      const mail = declineEmailHtml(application.name)
      try {
        await sendHtmlEmail(application.email, 'Your volunteer application', mail.html, mail.text)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Email failed.'
        throw new HttpsError('unavailable', message)
      }
      return { ok: true }
    }

    const password = generatePassword()
    let user: UserRecord
    try {
      user = await auth.createUser({
        email: application.email,
        password,
        displayName: application.name,
      })
    } catch {
      throw new HttpsError(
        'already-exists',
        'An account with this email already exists. Review cannot continue.',
      )
    }
    await auth.setCustomUserClaims(user.uid, { role: 'volunteer' })
    await db.collection('volunteers').add({
      name: application.name,
      email: application.email,
      phone: application.phone,
      address: application.address,
      status: 'active',
      trainingPercent: 0,
      hours: 0,
      authUid: user.uid,
      coordinatorUid: '',
      createdAt: FieldValue.serverTimestamp(),
    })
    await db.collection('profiles').doc(user.uid).set({
      uid: user.uid,
      displayName: application.name,
      email: application.email,
      role: 'volunteer',
      createdAt: FieldValue.serverTimestamp(),
    })
    await appRef.update({
      status: 'approved',
      reviewedAt: FieldValue.serverTimestamp(),
    })
    const mail = welcomeEmailHtml(application.name, application.email, password)
    try {
      await sendHtmlEmail(
        application.email,
        'Your volunteer account is ready',
        mail.html,
        mail.text,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email failed.'
      throw new HttpsError('unavailable', message)
    }
    return { ok: true }
  },
)

type BulkEmailAudience = 'all' | 'users' | 'volunteers'
type EmailSource = 'compose' | 'bulk' | 'contact' | 'inbound'
type EmailFolder = 'inbox' | 'sent'

const PUBLIC_INQUIRY_EMAIL = 'inquiry@melbournehealth.org.au'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readAudience(data: Record<string, unknown>): BulkEmailAudience {
  const value = readString(data, 'audience')
  if (value === 'all' || value === 'users' || value === 'volunteers') {
    return value
  }
  throw new HttpsError('invalid-argument', 'audience must be all, users, or volunteers.')
}

async function writeEmailRecord(record: {
  readonly to: string
  readonly fromAddress: string
  readonly subject: string
  readonly body: string
  readonly source: EmailSource
  readonly folder: EmailFolder
  readonly threadId: string
  readonly contactId: string
}): Promise<void> {
  await db.collection('emails').add({
    to: record.to,
    fromAddress: record.fromAddress,
    subject: record.subject,
    body: record.body,
    source: record.source,
    folder: record.folder,
    threadId: record.threadId,
    contactId: record.contactId,
    createdAt: FieldValue.serverTimestamp(),
  })
}

async function collectVolunteerEmails(volunteerIds: readonly string[]): Promise<Set<string>> {
  const emails = new Set<string>()
  if (volunteerIds.length > 0) {
    for (const volunteerId of volunteerIds) {
      const docSnap = await db.collection('volunteers').doc(volunteerId).get()
      if (!docSnap.exists) {
        continue
      }
      const email = readString(asRecord(docSnap.data()), 'email')
      if (email.length > 0) {
        emails.add(email)
      }
    }
    return emails
  }
  const snap = await db.collection('volunteers').get()
  for (const docSnap of snap.docs) {
    const email = readString(asRecord(docSnap.data()), 'email')
    if (email.length > 0) {
      emails.add(email)
    }
  }
  return emails
}

async function collectProfileEmails(role: 'user' | 'all'): Promise<Set<string>> {
  const emails = new Set<string>()
  const snap = await db.collection('profiles').get()
  for (const docSnap of snap.docs) {
    const data = asRecord(docSnap.data())
    const profileRole = readString(data, 'role')
    if (role !== 'all' && profileRole !== role) {
      continue
    }
    const email = readString(data, 'email')
    if (email.length > 0) {
      emails.add(email)
    }
  }
  return emails
}

export const sendBulkEmail = onCall(
  { cors: true },
  async (request): Promise<{ readonly sent: number }> => {
    requireAdmin(request.auth?.token['role'])
    const payload = asRecord(request.data)
    const subject = readString(payload, 'subject')
    const body = readString(payload, 'body')
    const audience = readAudience(payload)
    const volunteerIds = readStringArray(payload, 'volunteerIds')
    if (subject.length === 0 || body.length === 0) {
      throw new HttpsError('invalid-argument', 'Subject and body are required.')
    }

    const emails = new Set<string>()
    if (volunteerIds.length > 0) {
      const selected = await collectVolunteerEmails(volunteerIds)
      for (const email of selected) {
        emails.add(email)
      }
    } else if (audience === 'volunteers') {
      const volunteerEmails = await collectVolunteerEmails([])
      for (const email of volunteerEmails) {
        emails.add(email)
      }
    } else if (audience === 'users') {
      const userEmails = await collectProfileEmails('user')
      for (const email of userEmails) {
        emails.add(email)
      }
    } else {
      const volunteerEmails = await collectVolunteerEmails([])
      const userEmails = await collectProfileEmails('user')
      for (const email of volunteerEmails) {
        emails.add(email)
      }
      for (const email of userEmails) {
        emails.add(email)
      }
    }

    try {
      const sent = await sendBulkBccEmail([...emails], subject, body)
      await writeEmailRecord({
        to: PUBLIC_INQUIRY_EMAIL,
        fromAddress: resendFrom(),
        subject,
        body,
        source: 'bulk',
        folder: 'sent',
        threadId: '',
        contactId: '',
      })
      return { sent }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email failed.'
      throw new HttpsError('unavailable', message)
    }
  },
)

export const sendDirectEmail = onCall(
  { cors: true },
  async (request): Promise<{ readonly ok: true }> => {
    requireAdmin(request.auth?.token['role'])
    const payload = asRecord(request.data)
    const to = readString(payload, 'to')
    const subject = readString(payload, 'subject')
    const body = readString(payload, 'body')
    const contactId = readString(payload, 'contactId')
    if (!EMAIL_PATTERN.test(to) || subject.length === 0 || body.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'A valid to address, subject, and body are required.',
      )
    }
    try {
      await sendPlainEmail(to, subject, body)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email failed.'
      throw new HttpsError('unavailable', message)
    }
    const source: EmailSource = contactId.length > 0 ? 'contact' : 'compose'
    await writeEmailRecord({
      to,
      fromAddress: resendFrom(),
      subject,
      body,
      source,
      folder: 'sent',
      threadId: contactId,
      contactId,
    })
    if (contactId.length > 0) {
      await db.collection('contact_messages').doc(contactId).update({
        repliedAt: FieldValue.serverTimestamp(),
      })
    }
    return { ok: true }
  },
)

export const onContactMessageCreated = onDocumentCreated(
  'contact_messages/{contactId}',
  async (event): Promise<void> => {
    const snap = event.data
    if (snap === undefined) {
      return
    }
    const data = asRecord(snap.data())
    const name = readString(data, 'name')
    const email = readString(data, 'email')
    const subject = readString(data, 'subject')
    const message = readString(data, 'message')
    if (email.length === 0 || message.length === 0) {
      return
    }
    await writeEmailRecord({
      to: PUBLIC_INQUIRY_EMAIL,
      fromAddress: email,
      subject: subject.length > 0 ? subject : `Contact from ${name}`,
      body: message,
      source: 'inbound',
      folder: 'inbox',
      threadId: snap.id,
      contactId: snap.id,
    })
  },
)
