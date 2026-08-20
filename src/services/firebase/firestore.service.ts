import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { auth, db } from '@/services/firebase/config'
import { decryptInboxBody, encryptInboxBody } from '@/utils/messageCrypto'
import type {
  AdminEventStatus,
  AdminVolunteerStatus,
  AppointmentDoc,
  AssistanceRequestDoc,
  ContactMessageDoc,
  DonationDoc,
  DonationFrequency,
  EventRecordDoc,
  EventRegistrationDoc,
  InboxMessageDoc,
  LiveChatDoc,
  LiveChatMessageDoc,
  LiveChatOrigin,
  LiveChatSender,
  LiveChatStatus,
  MessageFromRole,
  MessageThreadDoc,
  EmailDoc,
  EmailFolder,
  EmailSource,
  ProfileDoc,
  ReportDoc,
  SavedResourceDoc,
  ServiceReviewDoc,
  ThreadMessageDoc,
  TransportRequired,
  VolunteerApplicationDoc,
  VolunteerApplicationReviewStatus,
  VolunteerHoursDoc,
  VolunteerRecordDoc,
  AuditLogAction,
  AuditLogDoc,
} from '@/types/firestore'

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function asString(data: Record<string, unknown>, field: string): string {
  const value = data[field]
  return isString(value) ? value : ''
}

function asNumber(data: Record<string, unknown>, field: string): number {
  const value = data[field]
  return isNumber(value) ? value : 0
}

function asBoolean(data: Record<string, unknown>, field: string): boolean {
  const value = data[field]
  return isBoolean(value) ? value : false
}

function asAuditAction(data: Record<string, unknown>, field: string): AuditLogAction {
  const value = asString(data, field)
  if (value === 'create' || value === 'update' || value === 'delete') {
    return value
  }
  return 'update'
}

function asStringArray(data: Record<string, unknown>, field: string): string[] {
  const value = data[field]
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter(isString)
}

function toUnknownRecord(data: object): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    result[key] = value
  }
  return result
}

function asTimestampMillis(data: Record<string, unknown>, field: string): number {
  const value = data[field]
  if (typeof value !== 'object' || value === null) {
    return 0
  }
  const toMillis: unknown = Reflect.get(value, 'toMillis')
  if (typeof toMillis !== 'function') {
    return 0
  }
  const millis: unknown = Reflect.apply(toMillis, value, [])
  return typeof millis === 'number' && !Number.isNaN(millis) ? millis : 0
}

function isDonationFrequency(value: unknown): value is DonationFrequency {
  return value === 'one-off' || value === 'monthly'
}

function asDonationFrequency(data: Record<string, unknown>, field: string): DonationFrequency {
  const value = data[field]
  return isDonationFrequency(value) ? value : 'one-off'
}

function isTransportRequired(value: unknown): value is TransportRequired {
  return value === 'yes' || value === 'no'
}

function asTransportRequired(data: Record<string, unknown>, field: string): TransportRequired {
  const value = data[field]
  return isTransportRequired(value) ? value : 'no'
}

function isAdminVolunteerStatus(value: unknown): value is AdminVolunteerStatus {
  return value === 'active' || value === 'pending'
}

function asAdminVolunteerStatus(
  data: Record<string, unknown>,
  field: string,
): AdminVolunteerStatus {
  const value = data[field]
  return isAdminVolunteerStatus(value) ? value : 'pending'
}

function isAdminEventStatus(value: unknown): value is AdminEventStatus {
  return value === 'published' || value === 'draft'
}

function asAdminEventStatus(data: Record<string, unknown>, field: string): AdminEventStatus {
  const value = data[field]
  return isAdminEventStatus(value) ? value : 'draft'
}

function isApplicationStatus(value: unknown): value is VolunteerApplicationReviewStatus {
  return value === 'pending' || value === 'approved' || value === 'denied'
}

function asApplicationStatus(
  data: Record<string, unknown>,
  field: string,
): VolunteerApplicationReviewStatus {
  const value = data[field]
  return isApplicationStatus(value) ? value : 'pending'
}

function isMessageFromRole(value: unknown): value is MessageFromRole {
  return value === 'admin' || value === 'user' || value === 'volunteer'
}

function asMessageFromRole(data: Record<string, unknown>, field: string): MessageFromRole {
  const value = data[field]
  return isMessageFromRole(value) ? value : 'admin'
}

function isLiveChatStatus(value: unknown): value is LiveChatStatus {
  return value === 'open' || value === 'closed'
}

function asLiveChatStatus(data: Record<string, unknown>, field: string): LiveChatStatus {
  const value = data[field]
  return isLiveChatStatus(value) ? value : 'open'
}

function isLiveChatSender(value: unknown): value is LiveChatSender {
  return value === 'visitor' || value === 'user' || value === 'volunteer' || value === 'admin'
}

function asLiveChatSender(data: Record<string, unknown>, field: string): LiveChatSender {
  const value = data[field]
  if (value === 'guest') {
    return 'visitor'
  }
  return isLiveChatSender(value) ? value : 'visitor'
}

function isLiveChatOrigin(value: unknown): value is LiveChatOrigin {
  return value === 'visitor' || value === 'registered'
}

function asLiveChatOrigin(data: Record<string, unknown>, field: string): LiveChatOrigin {
  const value = data[field]
  return isLiveChatOrigin(value) ? value : 'visitor'
}

function isEmailFolder(value: unknown): value is EmailFolder {
  return value === 'inbox' || value === 'sent'
}

function asEmailFolder(data: Record<string, unknown>, field: string): EmailFolder {
  const value = data[field]
  return isEmailFolder(value) ? value : 'inbox'
}

function isEmailSource(value: unknown): value is EmailSource {
  return value === 'compose' || value === 'bulk' || value === 'contact' || value === 'inbound'
}

function asEmailSource(data: Record<string, unknown>, field: string): EmailSource {
  const value = data[field]
  return isEmailSource(value) ? value : 'inbound'
}

function asOptionalTimestampMillis(
  data: Record<string, unknown>,
  field: string,
): number | undefined {
  if (!(field in data)) {
    return undefined
  }
  const millis = asTimestampMillis(data, field)
  return millis > 0 ? millis : undefined
}

const contactConverter: FirestoreDataConverter<ContactMessageDoc> = {
  toFirestore(message: ContactMessageDoc): DocumentData {
    return {
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): ContactMessageDoc {
    const data = toUnknownRecord(snap.data())
    const repliedAt = asOptionalTimestampMillis(data, 'repliedAt')
    const base: ContactMessageDoc = {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      subject: asString(data, 'subject'),
      message: asString(data, 'message'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
    if (repliedAt === undefined) {
      return base
    }
    return { ...base, repliedAt }
  },
}

const assistanceConverter: FirestoreDataConverter<AssistanceRequestDoc> = {
  toFirestore(request: AssistanceRequestDoc): DocumentData {
    return {
      name: request.name,
      email: request.email,
      phone: request.phone,
      need: request.need,
      message: request.message,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): AssistanceRequestDoc {
    const data = toUnknownRecord(snap.data())
    return {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      need: asString(data, 'need'),
      message: asString(data, 'message'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const donationConverter: FirestoreDataConverter<DonationDoc> = {
  toFirestore(donation: DonationDoc): DocumentData {
    return {
      amount: donation.amount,
      frequency: donation.frequency,
      name: donation.name,
      email: donation.email,
      message: donation.message,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): DonationDoc {
    const data = toUnknownRecord(snap.data())
    return {
      amount: asNumber(data, 'amount'),
      frequency: asDonationFrequency(data, 'frequency'),
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      message: asString(data, 'message'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const volunteerApplicationConverter: FirestoreDataConverter<VolunteerApplicationDoc> = {
  toFirestore(application: VolunteerApplicationDoc): DocumentData {
    return {
      name: application.name,
      email: application.email,
      phone: application.phone,
      address: application.address,
      interests: [...application.interests],
      availability: application.availability,
      message: application.message,
      status: application.status,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): VolunteerApplicationDoc {
    const data = toUnknownRecord(snap.data())
    const reviewedAt = asOptionalTimestampMillis(data, 'reviewedAt')
    const base: VolunteerApplicationDoc = {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      address: asString(data, 'address'),
      interests: asStringArray(data, 'interests'),
      availability: asString(data, 'availability'),
      message: asString(data, 'message'),
      status: asApplicationStatus(data, 'status'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
    if (reviewedAt === undefined) {
      return base
    }
    return { ...base, reviewedAt }
  },
}

const eventRegistrationConverter: FirestoreDataConverter<EventRegistrationDoc> = {
  toFirestore(registration: EventRegistrationDoc): DocumentData {
    return {
      eventSlug: registration.eventSlug,
      userId: registration.userId,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      attendees: registration.attendees,
      accessibilityRequirements: registration.accessibilityRequirements,
      optInUpdates: registration.optInUpdates,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): EventRegistrationDoc {
    const data = toUnknownRecord(snap.data())
    return {
      eventSlug: asString(data, 'eventSlug'),
      userId: asString(data, 'userId'),
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      attendees: asString(data, 'attendees'),
      accessibilityRequirements: asString(data, 'accessibilityRequirements'),
      optInUpdates: asBoolean(data, 'optInUpdates'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const appointmentConverter: FirestoreDataConverter<AppointmentDoc> = {
  toFirestore(appointment: AppointmentDoc): DocumentData {
    return {
      userId: appointment.userId,
      name: appointment.name,
      date: appointment.date,
      time: appointment.time,
      serviceSlug: appointment.serviceSlug,
      supportType: appointment.supportType,
      accessibilityRequirements: appointment.accessibilityRequirements,
      transportRequired: appointment.transportRequired,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): AppointmentDoc {
    const data = toUnknownRecord(snap.data())
    return {
      userId: asString(data, 'userId'),
      name: asString(data, 'name'),
      date: asString(data, 'date'),
      time: asString(data, 'time'),
      serviceSlug: asString(data, 'serviceSlug'),
      supportType: asString(data, 'supportType'),
      accessibilityRequirements: asString(data, 'accessibilityRequirements'),
      transportRequired: asTransportRequired(data, 'transportRequired'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

async function addSubmission<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  data: T,
): Promise<void> {
  const ref = collection(db, path).withConverter(converter)
  await addDoc(ref, data)
}

export async function submitContact(message: ContactMessageDoc): Promise<void> {
  await addSubmission('contact_messages', contactConverter, message)
}

export async function submitAssistance(request: AssistanceRequestDoc): Promise<void> {
  await addSubmission('assistance_requests', assistanceConverter, request)
}

export async function submitDonation(donation: DonationDoc): Promise<void> {
  await addSubmission('donations', donationConverter, donation)
}

export async function submitVolunteerApplication(
  application: VolunteerApplicationDoc,
): Promise<void> {
  await addSubmission('volunteer_applications', volunteerApplicationConverter, application)
}

export async function submitEventRegistration(registration: EventRegistrationDoc): Promise<void> {
  await addSubmission('event_registrations', eventRegistrationConverter, registration)
}

export async function submitBooking(appointment: AppointmentDoc): Promise<void> {
  await addSubmission('appointments', appointmentConverter, appointment)
}

const volunteerRecordConverter: FirestoreDataConverter<VolunteerRecordDoc> = {
  toFirestore(record: VolunteerRecordDoc): DocumentData {
    return {
      name: record.name,
      email: record.email,
      phone: record.phone,
      address: record.address,
      status: record.status,
      trainingPercent: record.trainingPercent,
      hours: record.hours,
      authUid: record.authUid,
      coordinatorUid: record.coordinatorUid,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): VolunteerRecordDoc {
    const data = toUnknownRecord(snap.data())
    return {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      address: asString(data, 'address'),
      status: asAdminVolunteerStatus(data, 'status'),
      trainingPercent: asNumber(data, 'trainingPercent'),
      hours: asNumber(data, 'hours'),
      authUid: asString(data, 'authUid'),
      coordinatorUid: asString(data, 'coordinatorUid'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const eventRecordConverter: FirestoreDataConverter<EventRecordDoc> = {
  toFirestore(record: EventRecordDoc): DocumentData {
    return {
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      description: record.description,
      date: record.date,
      time: record.time,
      location: record.location,
      status: record.status,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): EventRecordDoc {
    const data = toUnknownRecord(snap.data())
    return {
      title: asString(data, 'title'),
      slug: asString(data, 'slug'),
      summary: asString(data, 'summary'),
      description: asString(data, 'description'),
      date: asString(data, 'date'),
      time: asString(data, 'time'),
      location: asString(data, 'location'),
      status: asAdminEventStatus(data, 'status'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const volunteerHoursConverter: FirestoreDataConverter<VolunteerHoursDoc> = {
  toFirestore(entry: VolunteerHoursDoc): DocumentData {
    return {
      volunteerId: entry.volunteerId,
      volunteerName: entry.volunteerName,
      hours: entry.hours,
      month: entry.month,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): VolunteerHoursDoc {
    const data = toUnknownRecord(snap.data())
    return {
      volunteerId: asString(data, 'volunteerId'),
      volunteerName: asString(data, 'volunteerName'),
      hours: asNumber(data, 'hours'),
      month: asString(data, 'month'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const reportConverter: FirestoreDataConverter<ReportDoc> = {
  toFirestore(report: ReportDoc): DocumentData {
    return {
      title: report.title,
      type: report.type,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): ReportDoc {
    const data = toUnknownRecord(snap.data())
    return {
      title: asString(data, 'title'),
      type: asString(data, 'type'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

export interface WithId<T> {
  readonly id: string
  readonly data: T
}

function toWithId<T>(snap: QueryDocumentSnapshot<T>): WithId<T> {
  return { id: snap.id, data: snap.data() }
}

async function createAdminRecord<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  data: T,
): Promise<string> {
  const ref = collection(db, path).withConverter(converter)
  const docRef = await addDoc(ref, data)
  return docRef.id
}

function subscribeQuery<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  constraints: readonly QueryConstraint[],
  callback: (records: readonly WithId<T>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = collection(db, path).withConverter(converter)
  const parsedQuery = query(ref, ...constraints)
  return onSnapshot(
    parsedQuery,
    (snap) => {
      callback(snap.docs.map((item) => toWithId(item)))
    },
    onError !== undefined ? (error) => onError(error) : undefined,
  )
}

function subscribeAdminRecords<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  callback: (records: readonly WithId<T>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(path, converter, [], callback, onError)
}

async function decryptInboxRecords(
  records: readonly WithId<InboxMessageDoc>[],
): Promise<readonly WithId<InboxMessageDoc>[]> {
  return Promise.all(
    records.map(async (record) => ({
      id: record.id,
      data: {
        userId: record.data.userId,
        sender: record.data.sender,
        body: await decryptInboxBody(record.data.userId, record.data.body),
        fromRole: record.data.fromRole,
        createdAt: record.data.createdAt,
      },
    })),
  )
}

function subscribeEncryptedInbox(
  constraints: readonly QueryConstraint[],
  callback: (records: readonly WithId<InboxMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let generation = 0
  return subscribeQuery(
    'messages',
    inboxMessageConverter,
    constraints,
    (records) => {
      generation += 1
      const current = generation
      void decryptInboxRecords(records).then((decrypted) => {
        if (current === generation) {
          callback(decrypted)
        }
      })
    },
    onError,
  )
}

async function updateAdminRecord<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  id: string,
  patch: Partial<T>,
): Promise<void> {
  const ref = doc(db, path, id).withConverter(converter)
  await updateDoc(ref, patch as Record<string, unknown>)
}

async function deleteAdminRecord(path: string, id: string): Promise<void> {
  const ref = doc(db, path, id)
  await deleteDoc(ref)
}

const auditLogConverter: FirestoreDataConverter<AuditLogDoc> = {
  toFirestore(entry: AuditLogDoc): DocumentData {
    return {
      actorUid: entry.actorUid,
      actorEmail: entry.actorEmail,
      action: entry.action,
      collection: entry.collection,
      documentId: entry.documentId,
      summary: entry.summary,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): AuditLogDoc {
    const data = toUnknownRecord(snap.data())
    return {
      actorUid: asString(data, 'actorUid'),
      actorEmail: asString(data, 'actorEmail'),
      action: asAuditAction(data, 'action'),
      collection: asString(data, 'collection'),
      documentId: asString(data, 'documentId'),
      summary: asString(data, 'summary'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

export async function writeAuditLog(entry: {
  readonly action: AuditLogAction
  readonly collection: string
  readonly documentId: string
  readonly summary: string
}): Promise<void> {
  const user = auth.currentUser
  if (user === null) {
    return
  }
  const ref = collection(db, 'audit_logs').withConverter(auditLogConverter)
  await addDoc(ref, {
    actorUid: user.uid,
    actorEmail: user.email ?? '',
    action: entry.action,
    collection: entry.collection,
    documentId: entry.documentId,
    summary: entry.summary,
    createdAt: Date.now(),
  })
}

async function recordAudit(
  action: AuditLogAction,
  collectionName: string,
  documentId: string,
  summary: string,
): Promise<void> {
  try {
    await writeAuditLog({ action, collection: collectionName, documentId, summary })
  } catch {
    return
  }
}

export async function createVolunteer(record: VolunteerRecordDoc): Promise<string> {
  const id = await createAdminRecord('volunteers', volunteerRecordConverter, record)
  await recordAudit('create', 'volunteers', id, `Created volunteer ${record.name}`)
  return id
}

export function subscribeVolunteers(
  callback: (records: readonly WithId<VolunteerRecordDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('volunteers', volunteerRecordConverter, callback, onError)
}

export async function getVolunteerById(id: string): Promise<VolunteerRecordDoc | undefined> {
  const ref = doc(db, 'volunteers', id).withConverter(volunteerRecordConverter)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : undefined
}

export async function updateVolunteer(
  id: string,
  patch: Partial<VolunteerRecordDoc>,
): Promise<void> {
  await updateAdminRecord('volunteers', volunteerRecordConverter, id, patch)
  await recordAudit('update', 'volunteers', id, 'Updated volunteer record')
}

export async function deleteVolunteer(id: string): Promise<void> {
  await deleteAdminRecord('volunteers', id)
  await recordAudit('delete', 'volunteers', id, 'Deleted volunteer record')
}

export async function logVolunteerHours(entry: VolunteerHoursDoc): Promise<string> {
  const id = await createAdminRecord('volunteer_hours', volunteerHoursConverter, entry)
  await recordAudit(
    'create',
    'volunteer_hours',
    id,
    `Logged ${String(entry.hours)} hours for ${entry.volunteerName}`,
  )
  return id
}

export function subscribeVolunteerHours(
  callback: (records: readonly WithId<VolunteerHoursDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('volunteer_hours', volunteerHoursConverter, callback, onError)
}

export async function createEvent(record: EventRecordDoc): Promise<string> {
  const id = await createAdminRecord('events', eventRecordConverter, record)
  await recordAudit('create', 'events', id, `Created event ${record.title}`)
  return id
}

export function subscribeEvents(
  callback: (records: readonly WithId<EventRecordDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('events', eventRecordConverter, callback, onError)
}

export async function getEventById(id: string): Promise<EventRecordDoc | undefined> {
  const ref = doc(db, 'events', id).withConverter(eventRecordConverter)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : undefined
}

export async function updateEvent(id: string, patch: Partial<EventRecordDoc>): Promise<void> {
  await updateAdminRecord('events', eventRecordConverter, id, patch)
  await recordAudit('update', 'events', id, 'Updated event record')
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteAdminRecord('events', id)
  await recordAudit('delete', 'events', id, 'Deleted event record')
}

export async function createReport(report: ReportDoc): Promise<string> {
  const id = await createAdminRecord('reports', reportConverter, report)
  await recordAudit('create', 'reports', id, `Generated report ${report.title}`)
  return id
}

export function subscribeReports(
  callback: (records: readonly WithId<ReportDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('reports', reportConverter, callback, onError)
}

export async function getRecentContactMessages(
  maxItems = 5,
): Promise<readonly WithId<ContactMessageDoc>[]> {
  const ref = collection(db, 'contact_messages').withConverter(contactConverter)
  const snap = await getDocs(query(ref))
  const all = snap.docs.map((item) => toWithId(item))
  return all
    .slice()
    .sort((a, b) => b.data.createdAt - a.data.createdAt)
    .slice(0, maxItems)
}

export async function getRecentVolunteerApplications(
  maxItems = 5,
): Promise<readonly WithId<VolunteerApplicationDoc>[]> {
  const ref = collection(db, 'volunteer_applications').withConverter(volunteerApplicationConverter)
  const snap = await getDocs(query(ref))
  const all = snap.docs.map((item) => toWithId(item))
  return all
    .slice()
    .sort((a, b) => b.data.createdAt - a.data.createdAt)
    .slice(0, maxItems)
}

export async function countContactMessages(): Promise<number> {
  const ref = collection(db, 'contact_messages').withConverter(contactConverter)
  const snap = await getDocs(query(ref))
  return snap.size
}

const inboxMessageConverter: FirestoreDataConverter<InboxMessageDoc> = {
  toFirestore(message: InboxMessageDoc): DocumentData {
    return {
      userId: message.userId,
      sender: message.sender,
      body: message.body,
      fromRole: message.fromRole,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): InboxMessageDoc {
    const data = toUnknownRecord(snap.data())
    const body = asString(data, 'body')
    const preview = asString(data, 'preview')
    return {
      userId: asString(data, 'userId'),
      sender: asString(data, 'sender'),
      body: body.length > 0 ? body : preview,
      fromRole: asMessageFromRole(data, 'fromRole'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const profileConverter: FirestoreDataConverter<ProfileDoc> = {
  toFirestore(profile: ProfileDoc): DocumentData {
    return {
      uid: profile.uid,
      displayName: profile.displayName,
      email: profile.email,
      role: profile.role,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): ProfileDoc {
    const data = toUnknownRecord(snap.data())
    return {
      uid: asString(data, 'uid'),
      displayName: asString(data, 'displayName'),
      email: asString(data, 'email'),
      role: asMessageFromRole(data, 'role'),
      createdAt: asTimestampMillis(data, 'createdAt'),
      disabled: asBoolean(data, 'disabled'),
    }
  },
}

const liveChatConverter: FirestoreDataConverter<LiveChatDoc> = {
  toFirestore(chat: LiveChatDoc): DocumentData {
    return {
      guestName: chat.guestName,
      guestEmail: chat.guestEmail,
      origin: chat.origin,
      userId: chat.userId,
      status: chat.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): LiveChatDoc {
    const data = toUnknownRecord(snap.data())
    return {
      guestName: asString(data, 'guestName'),
      guestEmail: asString(data, 'guestEmail'),
      origin: asLiveChatOrigin(data, 'origin'),
      userId: asString(data, 'userId'),
      status: asLiveChatStatus(data, 'status'),
      createdAt: asTimestampMillis(data, 'createdAt'),
      updatedAt: asTimestampMillis(data, 'updatedAt'),
    }
  },
}

const liveChatMessageConverter: FirestoreDataConverter<LiveChatMessageDoc> = {
  toFirestore(message: LiveChatMessageDoc): DocumentData {
    return {
      sender: message.sender,
      body: message.body,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): LiveChatMessageDoc {
    const data = toUnknownRecord(snap.data())
    return {
      sender: asLiveChatSender(data, 'sender'),
      body: asString(data, 'body'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const savedResourceConverter: FirestoreDataConverter<SavedResourceDoc> = {
  toFirestore(resource: SavedResourceDoc): DocumentData {
    return {
      userId: resource.userId,
      resourceId: resource.resourceId,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): SavedResourceDoc {
    const data = toUnknownRecord(snap.data())
    return {
      userId: asString(data, 'userId'),
      resourceId: asString(data, 'resourceId'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

export function subscribePublishedEvents(
  callback: (records: readonly WithId<EventRecordDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'events',
    eventRecordConverter,
    [where('status', '==', 'published')],
    callback,
    onError,
  )
}

export async function getPublishedEvents(): Promise<readonly WithId<EventRecordDoc>[]> {
  const ref = collection(db, 'events').withConverter(eventRecordConverter)
  const snap = await getDocs(query(ref, where('status', '==', 'published')))
  return snap.docs.map((item) => toWithId(item))
}

export async function getPublishedEventBySlug(
  slug: string,
): Promise<WithId<EventRecordDoc> | undefined> {
  const ref = collection(db, 'events').withConverter(eventRecordConverter)
  const snap = await getDocs(
    query(ref, where('status', '==', 'published'), where('slug', '==', slug), limit(1)),
  )
  const first = snap.docs[0]
  return first === undefined ? undefined : toWithId(first)
}

export function subscribeAppointmentsForUser(
  userId: string,
  callback: (records: readonly WithId<AppointmentDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'appointments',
    appointmentConverter,
    [where('userId', '==', userId)],
    callback,
    onError,
  )
}

export function subscribeEventRegistrationsForUser(
  userId: string,
  callback: (records: readonly WithId<EventRegistrationDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'event_registrations',
    eventRegistrationConverter,
    [where('userId', '==', userId)],
    callback,
    onError,
  )
}

export function subscribeMessagesForUser(
  userId: string,
  callback: (records: readonly WithId<InboxMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeEncryptedInbox([where('userId', '==', userId)], callback, onError)
}

export function subscribeSavedResourcesForUser(
  userId: string,
  callback: (records: readonly WithId<SavedResourceDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'saved_resources',
    savedResourceConverter,
    [where('userId', '==', userId)],
    callback,
    onError,
  )
}

function savedResourceDocId(userId: string, resourceId: string): string {
  return `${userId}_${resourceId}`
}

export async function saveResource(userId: string, resourceId: string): Promise<void> {
  const id = savedResourceDocId(userId, resourceId)
  const ref = doc(db, 'saved_resources', id).withConverter(savedResourceConverter)
  await setDoc(ref, { userId, resourceId, createdAt: Date.now() })
}

export async function unsaveResource(userId: string, resourceId: string): Promise<void> {
  const id = savedResourceDocId(userId, resourceId)
  await deleteDoc(doc(db, 'saved_resources', id))
}

export function subscribeVolunteerByAuthUid(
  authUid: string,
  callback: (record: WithId<VolunteerRecordDoc> | undefined) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'volunteers',
    volunteerRecordConverter,
    [where('authUid', '==', authUid), limit(1)],
    (records) => {
      callback(records[0])
    },
    onError,
  )
}

export function subscribeVolunteerHoursForVolunteer(
  volunteerId: string,
  callback: (records: readonly WithId<VolunteerHoursDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'volunteer_hours',
    volunteerHoursConverter,
    [where('volunteerId', '==', volunteerId)],
    callback,
    onError,
  )
}

export function subscribeVolunteerApplications(
  callback: (records: readonly WithId<VolunteerApplicationDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords(
    'volunteer_applications',
    volunteerApplicationConverter,
    callback,
    onError,
  )
}

export function subscribeInboxMessages(
  callback: (records: readonly WithId<InboxMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeEncryptedInbox([], callback, onError)
}

export async function createInboxMessage(message: InboxMessageDoc): Promise<string> {
  const body = await encryptInboxBody(message.userId, message.body)
  return createAdminRecord('messages', inboxMessageConverter, { ...message, body })
}

export async function upsertProfile(profile: ProfileDoc): Promise<void> {
  const ref = doc(db, 'profiles', profile.uid).withConverter(profileConverter)
  await setDoc(ref, profile)
}

export function subscribeProfiles(
  callback: (records: readonly WithId<ProfileDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('profiles', profileConverter, callback, onError)
}

export async function getProfile(uid: string): Promise<WithId<ProfileDoc> | undefined> {
  const ref = doc(db, 'profiles', uid).withConverter(profileConverter)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    return undefined
  }
  return { id: snap.id, data: snap.data() }
}

export async function updateProfileEmail(uid: string, email: string): Promise<void> {
  const ref = doc(db, 'profiles', uid)
  await updateDoc(ref, { email })
  await recordAudit('update', 'profiles', uid, 'Updated account email')
}

export function subscribeAuditLogs(
  callback: (records: readonly WithId<AuditLogDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('audit_logs', auditLogConverter, callback, onError)
}

export async function createLiveChat(chat: LiveChatDoc): Promise<string> {
  return createAdminRecord('live_chats', liveChatConverter, chat)
}

export function subscribeLiveChat(
  chatId: string,
  callback: (record: WithId<LiveChatDoc> | undefined) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = doc(db, 'live_chats', chatId).withConverter(liveChatConverter)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(undefined)
        return
      }
      callback({ id: snap.id, data: snap.data() })
    },
    onError !== undefined ? (error) => onError(error) : undefined,
  )
}

export function subscribeLiveChats(
  callback: (records: readonly WithId<LiveChatDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('live_chats', liveChatConverter, callback, onError)
}

export function subscribeLiveChatMessages(
  chatId: string,
  callback: (records: readonly WithId<LiveChatMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = collection(db, 'live_chats', chatId, 'messages').withConverter(
    liveChatMessageConverter,
  )
  return onSnapshot(
    query(ref),
    (snap) => {
      callback(snap.docs.map((item) => toWithId(item)))
    },
    onError !== undefined ? (error) => onError(error) : undefined,
  )
}

export async function addLiveChatMessage(
  chatId: string,
  message: LiveChatMessageDoc,
): Promise<void> {
  const ref = collection(db, 'live_chats', chatId, 'messages').withConverter(
    liveChatMessageConverter,
  )
  await addDoc(ref, message)
  const chatRef = doc(db, 'live_chats', chatId)
  await updateDoc(chatRef, { updatedAt: serverTimestamp() })
}

export async function updateLiveChatStatus(chatId: string, status: LiveChatStatus): Promise<void> {
  const ref = doc(db, 'live_chats', chatId)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

const messageThreadConverter: FirestoreDataConverter<MessageThreadDoc> = {
  toFirestore(thread: MessageThreadDoc): DocumentData {
    return {
      participantUids: [...thread.participantUids],
      initiatedByUid: thread.initiatedByUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): MessageThreadDoc {
    const data = toUnknownRecord(snap.data())
    return {
      participantUids: asStringArray(data, 'participantUids'),
      initiatedByUid: asString(data, 'initiatedByUid'),
      createdAt: asTimestampMillis(data, 'createdAt'),
      updatedAt: asTimestampMillis(data, 'updatedAt'),
    }
  },
}

const threadMessageConverter: FirestoreDataConverter<ThreadMessageDoc> = {
  toFirestore(message: ThreadMessageDoc): DocumentData {
    return {
      senderUid: message.senderUid,
      sender: message.sender,
      fromRole: message.fromRole,
      body: message.body,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): ThreadMessageDoc {
    const data = toUnknownRecord(snap.data())
    return {
      senderUid: asString(data, 'senderUid'),
      sender: asString(data, 'sender'),
      fromRole: asMessageFromRole(data, 'fromRole'),
      body: asString(data, 'body'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const emailConverter: FirestoreDataConverter<EmailDoc> = {
  toFirestore(email: EmailDoc): DocumentData {
    return {
      to: email.to,
      fromAddress: email.fromAddress,
      subject: email.subject,
      body: email.body,
      source: email.source,
      folder: email.folder,
      threadId: email.threadId,
      contactId: email.contactId,
      attachmentNames: [...email.attachmentNames],
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): EmailDoc {
    const data = toUnknownRecord(snap.data())
    return {
      to: asString(data, 'to'),
      fromAddress: asString(data, 'fromAddress'),
      subject: asString(data, 'subject'),
      body: asString(data, 'body'),
      source: asEmailSource(data, 'source'),
      folder: asEmailFolder(data, 'folder'),
      threadId: asString(data, 'threadId'),
      contactId: asString(data, 'contactId'),
      attachmentNames: asStringArray(data, 'attachmentNames'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const serviceReviewConverter: FirestoreDataConverter<ServiceReviewDoc> = {
  toFirestore(review: ServiceReviewDoc): DocumentData {
    return {
      userId: review.userId,
      displayName: review.displayName,
      serviceSlug: review.serviceSlug,
      appointmentId: review.appointmentId,
      rating: review.rating,
      comment: review.comment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): ServiceReviewDoc {
    const data = toUnknownRecord(snap.data())
    return {
      userId: asString(data, 'userId'),
      displayName: asString(data, 'displayName'),
      serviceSlug: asString(data, 'serviceSlug'),
      appointmentId: asString(data, 'appointmentId'),
      rating: asNumber(data, 'rating'),
      comment: asString(data, 'comment'),
      createdAt: asTimestampMillis(data, 'createdAt'),
      updatedAt: asTimestampMillis(data, 'updatedAt'),
    }
  },
}

export function subscribeMessageThreadsForUser(
  uid: string,
  callback: (records: readonly WithId<MessageThreadDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'message_threads',
    messageThreadConverter,
    [where('participantUids', 'array-contains', uid)],
    callback,
    onError,
  )
}

export function subscribeAllMessageThreads(
  callback: (records: readonly WithId<MessageThreadDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('message_threads', messageThreadConverter, callback, onError)
}

export async function createMessageThread(thread: MessageThreadDoc): Promise<string> {
  return createAdminRecord('message_threads', messageThreadConverter, thread)
}

export async function findThreadWithParticipant(
  selfUid: string,
  otherUid: string,
): Promise<string | undefined> {
  const ref = collection(db, 'message_threads').withConverter(messageThreadConverter)
  const snap = await getDocs(query(ref, where('participantUids', 'array-contains', selfUid)))
  const match = snap.docs.find((item) => item.data().participantUids.includes(otherUid))
  return match === undefined ? undefined : match.id
}

export async function findOrCreateMessageThread(
  selfUid: string,
  otherUid: string,
  initiatedByUid: string,
): Promise<string> {
  const existing = await findThreadWithParticipant(selfUid, otherUid)
  if (existing !== undefined) {
    return existing
  }
  return createMessageThread({
    participantUids: [selfUid, otherUid],
    initiatedByUid,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export function subscribeThreadMessages(
  threadId: string,
  callback: (records: readonly WithId<ThreadMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = collection(db, 'message_threads', threadId, 'messages').withConverter(
    threadMessageConverter,
  )
  let generation = 0
  return onSnapshot(
    query(ref),
    (snap) => {
      generation += 1
      const current = generation
      const records = snap.docs.map((item) => toWithId(item))
      void Promise.all(
        records.map(async (record) => ({
          id: record.id,
          data: {
            senderUid: record.data.senderUid,
            sender: record.data.sender,
            fromRole: record.data.fromRole,
            body: await decryptInboxBody(threadId, record.data.body),
            createdAt: record.data.createdAt,
          },
        })),
      ).then((decrypted) => {
        if (current === generation) {
          callback(decrypted)
        }
      })
    },
    onError !== undefined ? (error) => onError(error) : undefined,
  )
}

export async function addThreadMessage(threadId: string, message: ThreadMessageDoc): Promise<void> {
  const body = await encryptInboxBody(threadId, message.body)
  const ref = collection(db, 'message_threads', threadId, 'messages').withConverter(
    threadMessageConverter,
  )
  await addDoc(ref, { ...message, body })
  const threadRef = doc(db, 'message_threads', threadId)
  await updateDoc(threadRef, { updatedAt: serverTimestamp() })
}

export async function listThreadMessages(
  threadId: string,
): Promise<readonly WithId<ThreadMessageDoc>[]> {
  const ref = collection(db, 'message_threads', threadId, 'messages').withConverter(
    threadMessageConverter,
  )
  const snap = await getDocs(query(ref, limit(100)))
  const records = snap.docs.map((item) => toWithId(item))
  const decrypted = await Promise.all(
    records.map(async (record) => ({
      id: record.id,
      data: {
        senderUid: record.data.senderUid,
        sender: record.data.sender,
        fromRole: record.data.fromRole,
        body: await decryptInboxBody(threadId, record.data.body),
        createdAt: record.data.createdAt,
      },
    })),
  )
  return decrypted.slice().sort((left, right) => left.data.createdAt - right.data.createdAt)
}

export function subscribeLiveChatsForUser(
  userId: string,
  callback: (records: readonly WithId<LiveChatDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'live_chats',
    liveChatConverter,
    [where('userId', '==', userId)],
    callback,
    onError,
  )
}

export async function findLatestOpenLiveChatForUser(userId: string): Promise<string | undefined> {
  const ref = collection(db, 'live_chats').withConverter(liveChatConverter)
  const snap = await getDocs(query(ref, where('userId', '==', userId)))
  const open = snap.docs
    .map((item) => toWithId(item))
    .filter((record) => record.data.status === 'open')
    .sort((left, right) => right.data.updatedAt - left.data.updatedAt)
  const latest = open[0]
  return latest === undefined ? undefined : latest.id
}

export function subscribeContactMessages(
  callback: (records: readonly WithId<ContactMessageDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('contact_messages', contactConverter, callback, onError)
}

export function subscribeEmails(
  callback: (records: readonly WithId<EmailDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('emails', emailConverter, callback, onError)
}

export async function createEmailRecord(email: EmailDoc): Promise<string> {
  return createAdminRecord('emails', emailConverter, email)
}

export function serviceReviewId(userId: string, serviceSlug: string): string {
  return `${userId}_${serviceSlug}`
}

export function subscribeServiceReviewsForSlug(
  serviceSlug: string,
  callback: (records: readonly WithId<ServiceReviewDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'service_reviews',
    serviceReviewConverter,
    [where('serviceSlug', '==', serviceSlug)],
    callback,
    onError,
  )
}

export function subscribeServiceReviewsForUser(
  userId: string,
  callback: (records: readonly WithId<ServiceReviewDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeQuery(
    'service_reviews',
    serviceReviewConverter,
    [where('userId', '==', userId)],
    callback,
    onError,
  )
}

export async function upsertServiceReview(review: ServiceReviewDoc): Promise<void> {
  const id = serviceReviewId(review.userId, review.serviceSlug)
  const ref = doc(db, 'service_reviews', id).withConverter(serviceReviewConverter)
  const existing = await getDoc(ref)
  if (existing.exists()) {
    await updateDoc(ref, {
      rating: review.rating,
      comment: review.comment,
      updatedAt: serverTimestamp(),
    })
    return
  }
  await setDoc(ref, review)
}
