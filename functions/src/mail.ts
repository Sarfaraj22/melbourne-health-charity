import { Resend } from 'resend'
import { publicAppUrl, resendApiKey, resendFrom } from './env.js'

const BCC_CHUNK_SIZE = 40

export interface MailAttachment {
  readonly filename: string
  readonly contentType: string
  readonly contentBase64: string
}

function client(): Resend {
  return new Resend(resendApiKey())
}

function fromAddress(): string {
  return `Melbourne Health Charity <${resendFrom()}>`
}

function toResendAttachments(
  attachments: readonly MailAttachment[],
): { readonly filename: string; readonly content: Buffer; readonly contentType: string }[] {
  return attachments.map((attachment) => ({
    filename: attachment.filename,
    content: Buffer.from(attachment.contentBase64, 'base64'),
    contentType: attachment.contentType,
  }))
}

export async function sendHtmlEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  attachments: readonly MailAttachment[] = [],
): Promise<void> {
  const { error } = await client().emails.send({
    from: fromAddress(),
    to,
    subject,
    html,
    text,
    ...(attachments.length > 0 ? { attachments: toResendAttachments(attachments) } : {}),
  })
  if (error) {
    throw new Error(error.message)
  }
}

export async function sendPlainEmail(
  to: string,
  subject: string,
  body: string,
  attachments: readonly MailAttachment[] = [],
): Promise<void> {
  const html = `<p>${escapeHtml(body).replaceAll('\n', '<br/>')}</p>`
  await sendHtmlEmail(to, subject, html, body, attachments)
}

export async function sendBulkBccEmail(
  recipients: readonly string[],
  subject: string,
  body: string,
): Promise<number> {
  if (recipients.length === 0) {
    return 0
  }
  const resend = client()
  const from = fromAddress()
  let sent = 0
  for (let index = 0; index < recipients.length; index += BCC_CHUNK_SIZE) {
    const chunk = recipients.slice(index, index + BCC_CHUNK_SIZE)
    const { error } = await resend.emails.send({
      from,
      to: resendFrom(),
      bcc: [...chunk],
      subject,
      text: body,
    })
    if (error) {
      throw new Error(error.message)
    }
    sent += chunk.length
  }
  return sent
}

export async function sendPlainEmailToEach(
  recipients: readonly string[],
  subject: string,
  body: string,
  attachments: readonly MailAttachment[],
): Promise<number> {
  for (const to of recipients) {
    await sendPlainEmail(to, subject, body, attachments)
  }
  return recipients.length
}

export function welcomeEmailHtml(
  name: string,
  email: string,
  password: string,
): { readonly html: string; readonly text: string } {
  const loginUrl = `${publicAppUrl()}/login`
  const text = [
    `Hello ${name},`,
    '',
    'Your volunteer application has been approved. You can sign in with these details:',
    `Username (email): ${email}`,
    `Password: ${password}`,
    `Sign in: ${loginUrl}`,
    '',
    'Please change your password after you first sign in (Forgot password on the login page).',
    '',
    'Melbourne Health Charity',
  ].join('\n')
  const html = `<p>Hello ${escapeHtml(name)},</p>
<p>Your volunteer application has been approved. You can sign in with these details:</p>
<ul>
<li>Username (email): ${escapeHtml(email)}</li>
<li>Password: ${escapeHtml(password)}</li>
</ul>
<p><a href="${escapeHtml(loginUrl)}">Sign in</a></p>
<p>Please change your password after you first sign in (Forgot password on the login page).</p>
<p>Melbourne Health Charity</p>`
  return { html, text }
}

export function declineEmailHtml(name: string): { readonly html: string; readonly text: string } {
  const text = [
    `Hello ${name},`,
    '',
    'Thank you for applying to volunteer with Melbourne Health Charity. We are unable to offer you a volunteer place at this time.',
    '',
    'You are welcome to apply again in the future.',
    '',
    'Melbourne Health Charity',
  ].join('\n')
  const html = `<p>Hello ${escapeHtml(name)},</p>
<p>Thank you for applying to volunteer with Melbourne Health Charity. We are unable to offer you a volunteer place at this time.</p>
<p>You are welcome to apply again in the future.</p>
<p>Melbourne Health Charity</p>`
  return { html, text }
}

export function passwordResetEmailHtml(
  name: string,
  resetUrl: string,
): { readonly html: string; readonly text: string } {
  const greeting = name.length > 0 ? name : 'there'
  const text = [
    `Hello ${greeting},`,
    '',
    'We received a request to reset your Melbourne Health Charity password.',
    `Reset your password: ${resetUrl}`,
    '',
    'If you did not request this, you can ignore this email.',
    '',
    'Melbourne Health Charity',
  ].join('\n')
  const html = `<p>Hello ${escapeHtml(greeting)},</p>
<p>We received a request to reset your Melbourne Health Charity password.</p>
<p><a href="${escapeHtml(resetUrl)}">Reset your password</a></p>
<p>If you did not request this, you can ignore this email.</p>
<p>Melbourne Health Charity</p>`
  return { html, text }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
