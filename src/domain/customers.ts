import { bookingStartDate } from './time'
import type { Booking } from './types'

export interface CustomerSummary {
  phone: string
  name: string
  visits: number
  noShows: number
  totalSpentThb: number
  lastVisit?: Booking
  nextBooking?: Booking
  bookings: Booking[] // newest start first
}

export function deriveCustomers(bookings: readonly Booking[], now: Date): CustomerSummary[] {
  const byPhone = new Map<string, Booking[]>()
  for (const b of bookings) byPhone.set(b.customerPhone, [...(byPhone.get(b.customerPhone) ?? []), b])

  const out: CustomerSummary[] = []
  for (const [phone, list] of byPhone) {
    const sorted = [...list].sort((a, b) => +bookingStartDate(b) - +bookingStartDate(a))
    const latestCreated = list.reduce((a, b) => (b.createdAt > a.createdAt ? b : a))
    const completed = sorted.filter((b) => b.status === 'completed')
    const upcoming = sorted
      .filter((b) => (b.status === 'pending' || b.status === 'confirmed') && bookingStartDate(b) >= now)
      .at(-1)
    out.push({
      phone,
      name: latestCreated.customerName,
      visits: completed.length,
      noShows: sorted.filter((b) => b.status === 'no_show').length,
      totalSpentThb: completed.reduce((sum, b) => sum + b.priceThb, 0),
      lastVisit: completed[0],
      nextBooking: upcoming,
      bookings: sorted,
    })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}
