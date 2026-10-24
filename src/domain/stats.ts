import { bookingStartDate, dateKey } from './time'
import type { AppState, Booking } from './types'

const byStart = (a: Booking, b: Booking) => +bookingStartDate(a) - +bookingStartDate(b)

export interface TodayStats {
  todayCount: number
  pendingCount: number
  expectedRevenueThb: number
  nextUp?: Booking
}

export function todayStats(state: AppState, now: Date): TodayStats {
  const today = dateKey(now)
  const held = state.bookings.filter(
    (b) => b.date === today && (b.status === 'confirmed' || b.status === 'completed'),
  )
  return {
    todayCount: held.length,
    pendingCount: state.bookings.filter((b) => b.status === 'pending').length,
    expectedRevenueThb: held.reduce((sum, b) => sum + b.priceThb, 0),
    nextUp: state.bookings
      .filter((b) => b.status === 'confirmed' && bookingStartDate(b) >= now)
      .sort(byStart)[0],
  }
}

/** All Pending requests plus Confirmed bookings whose start has passed, earliest first. */
export function needsAction(state: AppState, now: Date): Booking[] {
  return state.bookings
    .filter((b) => b.status === 'pending' || (b.status === 'confirmed' && bookingStartDate(b) <= now))
    .sort(byStart)
}
