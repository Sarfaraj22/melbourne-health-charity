export interface ReviewVolunteerApplicationRequest {
  readonly applicationId: string
  readonly decision: 'approved' | 'denied'
}

export type BulkEmailAudience = 'all' | 'users' | 'volunteers'

export interface EmailAttachmentPayload {
  readonly filename: string
  readonly contentType: string
  readonly contentBase64: string
}

export interface SendBulkEmailRequest {
  readonly subject: string
  readonly body: string
  readonly audience: BulkEmailAudience
  readonly volunteerIds: readonly string[]
  readonly attachments: readonly EmailAttachmentPayload[]
}

export interface SendDirectEmailRequest {
  readonly to: string
  readonly subject: string
  readonly body: string
  readonly contactId: string
  readonly attachments: readonly EmailAttachmentPayload[]
}

export type ManageAuthUserAction = 'disable' | 'enable' | 'delete'

export interface ManageAuthUserRequest {
  readonly uid: string
  readonly action: ManageAuthUserAction
}

export interface ManageAuthUserResult {
  readonly ok: true
}

export interface ReviewVolunteerApplicationResult {
  readonly ok: true
}

export interface SendBulkEmailResult {
  readonly sent: number
}

export interface SendDirectEmailResult {
  readonly ok: true
}

export interface RequestPasswordResetRequest {
  readonly email: string
}

export interface RequestPasswordResetResult {
  readonly ok: true
}
