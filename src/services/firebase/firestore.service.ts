import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/services/firebase/config'
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
  ReportDoc,
  TransportRequired,
  VolunteerApplicationDoc,
  VolunteerHoursDoc,
  VolunteerRecordDoc,
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
    return {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      subject: asString(data, 'subject'),
      message: asString(data, 'message'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
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
      interests: [...application.interests],
      availability: application.availability,
      message: application.message,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): VolunteerApplicationDoc {
    const data = toUnknownRecord(snap.data())
    return {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      interests: asStringArray(data, 'interests'),
      availability: asString(data, 'availability'),
      message: asString(data, 'message'),
      createdAt: asTimestampMillis(data, 'createdAt'),
    }
  },
}

const eventRegistrationConverter: FirestoreDataConverter<EventRegistrationDoc> = {
  toFirestore(registration: EventRegistrationDoc): DocumentData {
    return {
      eventSlug: registration.eventSlug,
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

// ===============================================================
// Admin collection converters
// ===============================================================

const volunteerRecordConverter: FirestoreDataConverter<VolunteerRecordDoc> = {
  toFirestore(record: VolunteerRecordDoc): DocumentData {
    return {
      name: record.name,
      email: record.email,
      phone: record.phone,
      status: record.status,
      trainingPercent: record.trainingPercent,
      hours: record.hours,
      createdAt: serverTimestamp(),
    }
  },
  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): VolunteerRecordDoc {
    const data = toUnknownRecord(snap.data())
    return {
      name: asString(data, 'name'),
      email: asString(data, 'email'),
      phone: asString(data, 'phone'),
      status: asAdminVolunteerStatus(data, 'status'),
      trainingPercent: asNumber(data, 'trainingPercent'),
      hours: asNumber(data, 'hours'),
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

// ===============================================================
// Admin CRUD helpers
// ===============================================================

interface WithId<T> {
  readonly id: string
  readonly data: T
}

function toWithId<T>(snap: QueryDocumentSnapshot<DocumentData>): WithId<T> {
  return { id: snap.id, data: snap.data() as T }
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

function subscribeAdminRecords<T>(
  path: string,
  converter: FirestoreDataConverter<T>,
  callback: (records: readonly WithId<T>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ref = collection(db, path).withConverter(converter)
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.docs.map((s) => toWithId<T>(s)))
    },
    onError !== undefined ? (error) => onError(error as Error) : undefined,
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

// ===============================================================
// Volunteer CRUD
// ===============================================================

export async function createVolunteer(record: VolunteerRecordDoc): Promise<string> {
  return createAdminRecord('volunteers', volunteerRecordConverter, record)
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
  return snap.exists() ? (snap.data() as VolunteerRecordDoc) : undefined
}

export async function updateVolunteer(
  id: string,
  patch: Partial<VolunteerRecordDoc>,
): Promise<void> {
  await updateAdminRecord('volunteers', volunteerRecordConverter, id, patch)
}

export async function deleteVolunteer(id: string): Promise<void> {
  await deleteAdminRecord('volunteers', id)
}

// ===============================================================
// Volunteer hours
// ===============================================================

export async function logVolunteerHours(entry: VolunteerHoursDoc): Promise<string> {
  return createAdminRecord('volunteer_hours', volunteerHoursConverter, entry)
}

export function subscribeVolunteerHours(
  callback: (records: readonly WithId<VolunteerHoursDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('volunteer_hours', volunteerHoursConverter, callback, onError)
}

// ===============================================================
// Event CRUD
// ===============================================================

export async function createEvent(record: EventRecordDoc): Promise<string> {
  return createAdminRecord('events', eventRecordConverter, record)
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
  return snap.exists() ? (snap.data() as EventRecordDoc) : undefined
}

export async function updateEvent(id: string, patch: Partial<EventRecordDoc>): Promise<void> {
  await updateAdminRecord('events', eventRecordConverter, id, patch)
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteAdminRecord('events', id)
}

// ===============================================================
// Reports
// ===============================================================

export async function createReport(report: ReportDoc): Promise<string> {
  return createAdminRecord('reports', reportConverter, report)
}

export function subscribeReports(
  callback: (records: readonly WithId<ReportDoc>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeAdminRecords('reports', reportConverter, callback, onError)
}

// ===============================================================
// Admin read access to submission collections
// ===============================================================

export async function getRecentContactMessages(
  limit = 5,
): Promise<readonly WithId<ContactMessageDoc>[]> {
  const ref = collection(db, 'contact_messages').withConverter(contactConverter)
  const snap = await getDocs(query(ref))
  const all = snap.docs.map((s) => toWithId<ContactMessageDoc>(s))
  return all
    .slice()
    .sort((a, b) => b.data.createdAt - a.data.createdAt)
    .slice(0, limit)
}

export async function getRecentVolunteerApplications(
  limit = 5,
): Promise<readonly WithId<VolunteerApplicationDoc>[]> {
  const ref = collection(db, 'volunteer_applications').withConverter(volunteerApplicationConverter)
  const snap = await getDocs(query(ref))
  const all = snap.docs.map((s) => toWithId<VolunteerApplicationDoc>(s))
  return all
    .slice()
    .sort((a, b) => b.data.createdAt - a.data.createdAt)
    .slice(0, limit)
}

export async function countContactMessages(): Promise<number> {
  const ref = collection(db, 'contact_messages').withConverter(contactConverter)
  const snap = await getDocs(query(ref))
  return snap.size
}
