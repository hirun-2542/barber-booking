import { describe, expect, it } from 'vitest'
import { getAvailableSlots } from './slots'
import type { AppState, Booking, BookingStatus } from './types'

// 2026-10-12 is a Monday.
const MON = '2026-10-12'
const EARLY = new Date(2026, 9, 10, 9, 0)

function makeState(over: { buffer?: 0 | 5 | 10 | 15; bookings?: Booking[]; closedDates?: string[] } = {}): AppState {
  const day = { open: true, start: '10:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' }
  return {
    version: 1,
    services: [],
    bookings: over.bookings ?? [],
    availability: { weekly: Array.from({ length: 7 }, () => ({ ...day })), closedDates: over.closedDates ?? [] },
    settings: {
      shopName: 'Shop',
      address: '',
      phone: '0812345678',
      slotIntervalMin: 30,
      bufferMin: over.buffer ?? 0,
      maxAdvanceDays: 14,
      minNoticeHours: 1,
    },
  }
}

function booking(start: string, durationMin: number, status: BookingStatus = 'confirmed', id = 'b1'): Booking {
  return {
    id,
    ref: 'ABCDEF',
    serviceId: 'svc-1',
    date: MON,
    start,
    durationMin,
    priceThb: 350,
    customerName: 'Test',
    customerPhone: '0899999999',
    note: '',
    status,
    source: 'online',
    createdAt: '2026-10-01T00:00:00.000Z',
  }
}

const slots = (state: AppState, durationMin: number, over: Partial<Parameters<typeof getAvailableSlots>[0]> = {}) =>
  getAvailableSlots({ state, date: MON, durationMin, now: EARLY, mode: 'customer', ...over })

describe('getAvailableSlots', () => {
  it('offers nothing on a closed weekday or a Closed date', () => {
    const state = makeState({ closedDates: [MON] })
    expect(slots(state, 45)).toEqual([])
    const closedMon = makeState()
    closedMon.availability.weekly[1].open = false
    expect(slots(closedMon, 45)).toEqual([])
  })

  it('keeps services inside opening hours and out of the break', () => {
    const result = slots(makeState(), 45)
    expect(result).toContain('12:00')
    expect(result).toContain('19:00')
    expect(result).not.toContain('12:30')
    expect(result).not.toContain('13:30')
    expect(result).not.toContain('19:30')
  })

  it('lets a Pending booking hold its time and a Cancelled one release it', () => {
    const held = slots(makeState({ bookings: [booking('14:00', 45, 'pending')] }), 45)
    expect(held).not.toContain('14:00')
    expect(held).not.toContain('14:30')
    expect(held).toContain('15:00')
    const released = slots(makeState({ bookings: [booking('14:00', 45, 'cancelled')] }), 45)
    expect(released).toContain('14:00')
  })

  it('applies the buffer around existing bookings', () => {
    const result = slots(makeState({ buffer: 15, bookings: [booking('14:00', 45)] }), 45)
    expect(result).not.toContain('14:30')
    expect(result).toContain('15:00')
    expect(result).toContain('12:00')
  })

  it('applies minimum notice to customers but not to the owner', () => {
    const now = new Date(2026, 9, 12, 11, 10)
    const customer = slots(makeState(), 30, { now })
    expect(customer).not.toContain('12:00')
    expect(customer).toContain('12:30')
    expect(slots(makeState(), 30, { now, mode: 'owner' })).toContain('10:00')
  })

  it('limits customers to the maximum advance days but not the owner', () => {
    const date = '2026-10-25' // 15 days after EARLY
    expect(getAvailableSlots({ state: makeState(), date, durationMin: 30, now: EARLY, mode: 'customer' })).toEqual([])
    expect(
      getAvailableSlots({ state: makeState(), date, durationMin: 30, now: EARLY, mode: 'owner' }).length,
    ).toBeGreaterThan(0)
  })

  it('frees the booking being rescheduled via ignoreBookingId', () => {
    const state = makeState({ bookings: [booking('14:00', 45)] })
    expect(slots(state, 45)).not.toContain('14:00')
    expect(slots(state, 45, { ignoreBookingId: 'b1' })).toContain('14:00')
  })
})
