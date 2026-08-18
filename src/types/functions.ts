export interface ReviewVolunteerApplicationRequest {
  readonly applicationId: string
  readonly decision: 'approved' | 'denied'
}

export interface SendBulkEmailRequest {
  readonly subject: string
  readonly body: string
  readonly volunteerIds: readonly string[]
}

export interface ReviewVolunteerApplicationResult {
  readonly ok: true
}

export interface SendBulkEmailResult {
  readonly sent: number
}
