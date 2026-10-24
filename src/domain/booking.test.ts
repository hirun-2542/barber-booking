import { describe, expect, it } from 'vitest'
import {
  canCustomerCancel,
  canMarkOutcome,
  canTransition,
  formatPhone,
  generateRef,
  isValidPhone,
  normalizePhone,
} from './booking'
import type { Booking, Settings } from './types'

const settings: Settings = {
  shopName: 'Shop',
  address: '',
  phone: '0812345678',
  slotIntervalMin: 30,
  bufferMin: 0,
  maxAdvanceDays: 14,
  minNoticeHours: 1,
}

const at = (hour: number, minute = 0, status: Booking['status'] = 'confirmed'): Booking => ({
  id: 'b1',
  ref: 'ABCDEF',
  serviceId: 'svc-1',
  date: '2026-10-12',
  start: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  durationMin: 45,
  priceThb: 350,
  customerName: 'Test',
  customerPhone: '0899999999',
  note: '',
  status,
  source: 'online',
  createdAt: '2026-10-01T00:00:00.000Z',
})

describe('status transitions', () => {
  it('allows only the documented moves', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true)
    expect(canTransition('pending', 'completed')).toBe(false)
    expect(canTransition('confirmed', 'no_show')).toBe(true)
    expect(canTransition('completed', 'cancelled')).toBe(false)
    expect(canTransition('declined', 'confirmed')).toBe(false)
  })

  it('records outcomes only after the start time', () => {
    const b = at(14)
    expect(canMarkOutcome(b, new Date(2026, 9, 12, 13, 59))).toBe(false)
    expect(canMarkOutcome(b, new Date(2026, 9, 12, 14, 0))).toBe(true)
    expect(canMarkOutcome(at(14, 0, 'pending'), new Date(2026, 9, 12, 15, 0))).toBe(false)
  })
})

describe('customer cancellation window', () => {
  it('requires at least minNoticeHours before start', () => {
    const b = at(14)
    expect(canCustomerCancel(b, settings, new Date(2026, 9, 12, 12, 0))).toBe(true)
    expect(canCustomerCancel(b, settings, new Date(2026, 9, 12, 13, 30))).toBe(false)
    expect(canCustomerCancel(at(14, 0, 'completed'), settings, new Date(2026, 9, 12, 8, 0))).toBe(false)
  })
})

describe('reference codes and phones', () => {
  it('generates unique codes without ambiguous characters', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const ref = generateRef(seen)
      expect(ref).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
      expect(seen.has(ref)).toBe(false)
      seen.add(ref)
    }
  })

  it('validates and formats Thai mobile numbers', () => {
    expect(isValidPhone('0812345678')).toBe(true)
    expect(isValidPhone('812345678')).toBe(false)
    expect(isValidPhone('081234567')).toBe(false)
    expect(normalizePhone('081-234-5678')).toBe('0812345678')
    expect(formatPhone('0812345678')).toBe('081-234-5678')
  })
})
