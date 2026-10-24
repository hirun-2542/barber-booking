import { format, parse } from 'date-fns'
import type { Booking } from './types'

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function fromMin(n: number): string {
  const h = Math.floor(n / 60)
  const m = n % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function dateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export function parseDateKey(s: string): Date {
  return parse(s, 'yyyy-MM-dd', new Date(2000, 0, 1))
}

export function bookingStartDate(b: Pick<Booking, 'date' | 'start'>): Date {
  const d = parseDateKey(b.date)
  d.setMinutes(toMin(b.start))
  return d
}

export function bookingEndMin(b: Pick<Booking, 'start' | 'durationMin'>): number {
  return toMin(b.start) + b.durationMin
}
