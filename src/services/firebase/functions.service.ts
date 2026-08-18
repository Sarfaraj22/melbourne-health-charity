import { getFunctions, httpsCallable } from 'firebase/functions'
import { firebaseApp } from '@/services/firebase/config'
import type {
  ReviewVolunteerApplicationRequest,
  ReviewVolunteerApplicationResult,
  SendBulkEmailRequest,
  SendBulkEmailResult,
} from '@/types/functions'

const functions = getFunctions(firebaseApp, 'australia-southeast1')

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error('Unable to complete the request.')
}

export async function reviewVolunteerApplication(
  payload: ReviewVolunteerApplicationRequest,
): Promise<ReviewVolunteerApplicationResult> {
  const callable = httpsCallable<
    ReviewVolunteerApplicationRequest,
    ReviewVolunteerApplicationResult
  >(functions, 'reviewVolunteerApplication')
  try {
    const result = await callable(payload)
    return result.data
  } catch (error) {
    throw toError(error)
  }
}

export async function sendBulkEmail(payload: SendBulkEmailRequest): Promise<SendBulkEmailResult> {
  const callable = httpsCallable<SendBulkEmailRequest, SendBulkEmailResult>(
    functions,
    'sendBulkEmail',
  )
  try {
    const result = await callable(payload)
    return result.data
  } catch (error) {
    throw toError(error)
  }
}
