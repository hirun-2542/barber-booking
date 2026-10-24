import { addHours } from 'date-fns'
import { bookingStartDate } from './time'
import type { Booking, BookingStatus, Settings } from './types'

export const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  pending: ['confirmed', 'declined', 'cancelled'],
  confirmed: ['completed', 'no_show', 'cancelled'],
  declined: [],
  cancelled: [],
  completed: [],
  no_show: [],
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

/** Completed / no-show can only be recorded once the start time has passed. */
export function canMarkOutcome(b: Booking, now: Date): boolean {
  return b.status === 'confirmed' && bookingStartDate(b) <= now
}

export function canReschedule(b: Booking): boolean {
  return b.status === 'pending' || b.status === 'confirmed'
}

export function canCustomerCancel(b: Booking, s: Settings, now: Date): boolean {
  return canReschedule(b) && bookingStartDate(b) >= addHours(now, s.minNoticeHours)
}

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O, I, 0, 1

export function generateRef(existing: ReadonlySet<string>): string {
  for (;;) {
    let ref = ''
    for (let i = 0; i < 6; i++) ref += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]
    if (!existing.has(ref)) return ref
  }
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function isValidPhone(digits: string): boolean {
  return /^0\d{9}$/.test(digits)
}

export function formatPhone(digits: string): string {
  return isValidPhone(digits) ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : digits
}
