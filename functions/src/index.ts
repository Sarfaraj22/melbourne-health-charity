import { randomBytes } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getAuth, type UserRecord } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'
import { resendFrom, publicAppUrl } from './env.js'
import {
  declineEmailHtml,
  passwordResetEmailHtml,
  sendBulkBccEmail,
  sendHtmlEmail,
  sendPlainEmail,
  sendPlainEmailToEach,
  welcomeEmailHtml,
  type MailAttachment,
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

const ALLOWED_ATTACHMENT_TYPES = new Set<string>([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const MAX_ATTACHMENT_FILES = 3
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024

function parseAttachments(data: Record<string, unknown>): readonly MailAttachment[] {
  const value = data['attachments']
  if (value === undefined) {
    return []
  }
  if (!Array.isArray(value)) {
    throw new HttpsError('invalid-argument', 'Attachments must be a list.')
  }
  if (value.length > MAX_ATTACHMENT_FILES) {
    throw new HttpsError('invalid-argument', 'You can attach up to 3 files.')
  }
  const parsed: MailAttachment[] = []
  let totalBytes = 0
  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      throw new HttpsError('invalid-argument', 'Each attachment must include a file.')
    }
    const record = asRecord(item)
    const filename = readString(record, 'filename')
    const contentType = readString(record, 'contentType')
    const contentBase64 = readString(record, 'contentBase64')
    if (filename.length === 0 || filename.length > 200) {
      throw new HttpsError('invalid-argument', 'Each attachment needs a valid file name.')
    }
    if (!ALLOWED_ATTACHMENT_TYPES.has(contentType)) {
      throw new HttpsError(
        'invalid-argument',
        'Attachments must be PDF, Word, text, PNG, or JPEG files.',
      )
    }
    if (contentBase64.length === 0) {
      throw new HttpsError('invalid-argument', 'An attachment could not be read.')
    }
    const bytes = Buffer.from(contentBase64, 'base64')
    totalBytes += bytes.byteLength
    if (totalBytes > MAX_ATTACHMENT_BYTES) {
      throw new HttpsError('invalid-argument', 'Attachments must be 4 MB or smaller in total.')
    }
    parsed.push({ filename, contentType, contentBase64 })
  }
  return parsed
}

function attachmentNamesOf(attachments: readonly MailAttachment[]): readonly string[] {
  return attachments.map((attachment) => attachment.filename)
}

function requireAdmin(role: unknown): void {
  if (role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only administrators can perform this action.')
  }
}

function generatePassword(): string {
  return randomBytes(18).toString('base64url')
}

function firebaseAuthErrorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return ''
  }
  const code = Reflect.get(error, 'code')
  return typeof code === 'string' ? code : ''
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
      const actor = callerIdentity(request)
      await writeAuditLog(
        actor.uid,
        actor.email,
        'update',
        'volunteer_applications',
        applicationId,
        `Denied volunteer application for ${application.name}`,
      )
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
      disabled: false,
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
    const actor = callerIdentity(request)
    await writeAuditLog(
      actor.uid,
      actor.email,
      'update',
      'volunteer_applications',
      applicationId,
      `Approved volunteer application for ${application.name}`,
    )
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
  readonly attachmentNames: readonly string[]
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
    attachmentNames: [...record.attachmentNames],
    createdAt: FieldValue.serverTimestamp(),
  })
}

async function writeAuditLog(
  actorUid: string,
  actorEmail: string,
  action: string,
  collectionName: string,
  documentId: string,
  summary: string,
): Promise<void> {
  await db.collection('audit_logs').add({
    actorUid,
    actorEmail,
    action,
    collection: collectionName,
    documentId,
    summary,
    createdAt: FieldValue.serverTimestamp(),
  })
}

function callerIdentity(request: {
  readonly auth?: { readonly uid: string; readonly token: { readonly email?: unknown } }
}): { readonly uid: string; readonly email: string } {
  const uid = request.auth === undefined ? '' : request.auth.uid
  const emailClaim = request.auth === undefined ? undefined : request.auth.token.email
  const email = typeof emailClaim === 'string' ? emailClaim : ''
  return { uid, email }
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
    const attachments = parseAttachments(payload)
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
      const recipients = [...emails]
      const sent =
        attachments.length > 0
          ? await sendPlainEmailToEach(recipients, subject, body, attachments)
          : await sendBulkBccEmail(recipients, subject, body)
      await writeEmailRecord({
        to: PUBLIC_INQUIRY_EMAIL,
        fromAddress: resendFrom(),
        subject,
        body,
        source: 'bulk',
        folder: 'sent',
        threadId: '',
        contactId: '',
        attachmentNames: attachmentNamesOf(attachments),
      })
      const actor = callerIdentity(request)
      await writeAuditLog(
        actor.uid,
        actor.email,
        'create',
        'emails',
        'bulk',
        `Sent bulk email to ${String(sent)} recipients`,
      )
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
    const attachments = parseAttachments(payload)
    if (!EMAIL_PATTERN.test(to) || subject.length === 0 || body.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'A valid to address, subject, and body are required.',
      )
    }
    try {
      await sendPlainEmail(to, subject, body, attachments)
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
      attachmentNames: attachmentNamesOf(attachments),
    })
    if (contactId.length > 0) {
      await db.collection('contact_messages').doc(contactId).update({
        repliedAt: FieldValue.serverTimestamp(),
      })
    }
    const actor = callerIdentity(request)
    await writeAuditLog(
      actor.uid,
      actor.email,
      'create',
      'emails',
      contactId.length > 0 ? contactId : 'direct',
      `Sent email to ${to}`,
    )
    return { ok: true }
  },
)

export const requestPasswordReset = onCall(
  { cors: true, invoker: 'public' },
  async (request): Promise<{ readonly ok: true }> => {
    const payload = asRecord(request.data)
    const email = readString(payload, 'email').toLowerCase()
    if (!EMAIL_PATTERN.test(email)) {
      throw new HttpsError('invalid-argument', 'Please enter a valid email address.')
    }

    let user: UserRecord
    try {
      user = await auth.getUserByEmail(email)
    } catch (error) {
      if (firebaseAuthErrorCode(error) === 'auth/user-not-found') {
        await writeAuditLog(
          '',
          email,
          'update',
          'auth',
          'unknown',
          'Password reset requested for unknown email',
        )
        throw new HttpsError('not-found', 'We could not find an account with that email address.')
      }
      throw new HttpsError('internal', 'Unable to verify this email address.')
    }

    const displayName = user.displayName === undefined ? '' : user.displayName
    const continueUrl = `${publicAppUrl()}/login`
    try {
      const resetUrl = await auth.generatePasswordResetLink(email, { url: continueUrl })
      const mail = passwordResetEmailHtml(displayName, resetUrl)
      await sendHtmlEmail(
        email,
        'Reset your Melbourne Health Charity password',
        mail.html,
        mail.text,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send reset email.'
      throw new HttpsError('unavailable', message)
    }

    await writeAuditLog(user.uid, email, 'update', 'auth', user.uid, 'Password reset requested')
    return { ok: true }
  },
)

export const manageAuthUser = onCall(
  { cors: true },
  async (request): Promise<{ readonly ok: true }> => {
    requireAdmin(request.auth?.token['role'])
    const actor = callerIdentity(request)
    const payload = asRecord(request.data)
    const uid = readString(payload, 'uid')
    const action = readString(payload, 'action')
    if (uid.length === 0) {
      throw new HttpsError('invalid-argument', 'uid is required.')
    }
    if (action !== 'disable' && action !== 'enable' && action !== 'delete') {
      throw new HttpsError('invalid-argument', 'action must be disable, enable, or delete.')
    }
    if (actor.uid === uid) {
      throw new HttpsError('failed-precondition', 'You cannot change your own account here.')
    }
    const profileRef = db.collection('profiles').doc(uid)
    const profileSnap = await profileRef.get()
    if (!profileSnap.exists) {
      throw new HttpsError('not-found', 'Account profile not found.')
    }
    const rawProfile = profileSnap.data()
    if (rawProfile === undefined) {
      throw new HttpsError('not-found', 'Account profile not found.')
    }
    const profile = asRecord(rawProfile)
    const role = readString(profile, 'role')
    const email = readString(profile, 'email')
    const displayName = readString(profile, 'displayName')
    if (role === 'admin') {
      throw new HttpsError('permission-denied', 'Admin accounts cannot be changed here.')
    }
    const label = displayName.length > 0 ? displayName : email
    try {
      if (action === 'delete') {
        await auth.deleteUser(uid)
        await profileRef.delete()
        await writeAuditLog(
          actor.uid,
          actor.email,
          'delete',
          'profiles',
          uid,
          `Deleted account ${label}`,
        )
        return { ok: true }
      }
      const disabled = action === 'disable'
      await auth.updateUser(uid, { disabled })
      await profileRef.update({ disabled })
      await writeAuditLog(
        actor.uid,
        actor.email,
        'update',
        'profiles',
        uid,
        `${disabled ? 'Disabled' : 'Enabled'} account ${label}`,
      )
      return { ok: true }
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error
      }
      const message = error instanceof Error ? error.message : 'Unable to update this account.'
      throw new HttpsError('unavailable', message)
    }
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
      attachmentNames: [],
    })
  },
)
