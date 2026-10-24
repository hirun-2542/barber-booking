import { addDays, addHours } from 'date-fns'
import { bookingStartDate, dateKey, parseDateKey, toMin, fromMin } from './time'
import { OCCUPYING, type AppState } from './types'

export type SlotMode = 'customer' | 'owner'

export interface SlotQuery {
  state: AppState
  date: string
  durationMin: number
  now: Date
  mode: SlotMode
  ignoreBookingId?: string
}

export function getAvailableSlots(q: SlotQuery): string[] {
  const { state, date, durationMin, now, mode, ignoreBookingId } = q
  const { availability, settings, bookings } = state

  if (date < dateKey(now)) return []
  if (availability.closedDates.includes(date)) return []
  const hours = availability.weekly[parseDateKey(date).getDay()]
  if (!hours.open) return []
  if (mode === 'customer' && date > dateKey(addDays(now, settings.maxAdvanceDays))) return []

  const open = toMin(hours.start)
  const close = toMin(hours.end)
  const brk =
    hours.breakStart && hours.breakEnd ? ([toMin(hours.breakStart), toMin(hours.breakEnd)] as const) : null
  const busy = bookings.filter(
    (b) => b.date === date && b.id !== ignoreBookingId && OCCUPYING.includes(b.status),
  )
  const buffer = settings.bufferMin
  const earliest = mode === 'customer' ? addHours(now, settings.minNoticeHours) : null

  const out: string[] = []
  for (let s = open; s + durationMin <= close; s += settings.slotIntervalMin) {
    const e = s + durationMin
    if (brk && s < brk[1] && brk[0] < e) continue
    const clash = busy.some((b) => {
      const bs = toMin(b.start)
      return s < bs + b.durationMin + buffer && bs < e + buffer
    })
    if (clash) continue
    const start = fromMin(s)
    if (earliest && bookingStartDate({ date, start }) < earliest) continue
    out.push(start)
  }
  return out
}

export function isSlotFree(q: SlotQuery & { start: string }): boolean {
  return getAvailableSlots(q).includes(q.start)
}
