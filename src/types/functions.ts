export interface ReviewVolunteerApplicationRequest {
  readonly applicationId: string
  readonly decision: 'approved' | 'denied'
}

export type BulkEmailAudience = 'all' | 'users' | 'volunteers'

export interface SendBulkEmailRequest {
  readonly subject: string
  readonly body: string
  readonly audience: BulkEmailAudience
  readonly volunteerIds: readonly string[]
}

export interface SendDirectEmailRequest {
  readonly to: string
  readonly subject: string
  readonly body: string
  readonly contactId: string
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
