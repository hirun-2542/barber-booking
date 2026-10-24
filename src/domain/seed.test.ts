import { describe, expect, it } from 'vitest'
import { buildSeed } from './seed'
import { bookingEndMin, dateKey, parseDateKey, toMin } from './time'
import { OCCUPYING } from './types'

describe('buildSeed', () => {
  for (let offset = 0; offset < 7; offset++) {
    const now = new Date(2026, 9, 10 + offset, 12, 0)

    it(`is a coherent demo for ${dateKey(now)}`, () => {
      const state = buildSeed(now)
      const today = dateKey(now)

      expect(state.availability.weekly[now.getDay()].open).toBe(true)
      expect(state.bookings.some((b) => b.date === today)).toBe(true)
      expect(state.bookings.some((b) => b.status === 'pending')).toBe(true)

      const occupying = state.bookings.filter((b) => OCCUPYING.includes(b.status))
      for (const b of occupying) {
        const hours = state.availability.weekly[parseDateKey(b.date).getDay()]
        expect(hours.open).toBe(true)
        expect(state.availability.closedDates).not.toContain(b.date)
        expect(toMin(b.start)).toBeGreaterThanOrEqual(toMin(hours.start))
        expect(bookingEndMin(b)).toBeLessThanOrEqual(toMin(hours.end))
        const overlapsBreak = toMin(b.start) < toMin(hours.breakEnd!) && toMin(hours.breakStart!) < bookingEndMin(b)
        expect(overlapsBreak).toBe(false)
      }
      for (const a of occupying) {
        for (const b of occupying) {
          if (a.id === b.id || a.date !== b.date) continue
          expect(toMin(a.start) < bookingEndMin(b) && toMin(b.start) < bookingEndMin(a)).toBe(false)
        }
      }
    })
  }
})
