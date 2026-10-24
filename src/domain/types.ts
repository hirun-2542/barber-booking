export type Lang = 'en' | 'th'
export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed' | 'no_show'
export type LocalizedName = { en: string; th: string } // th === '' → fall back to en

export interface Service {
  id: string
  name: LocalizedName
  durationMin: number
  priceThb: number
  active: boolean
}

export interface Booking {
  id: string
  ref: string
  serviceId: string
  date: string // 'yyyy-MM-dd'
  start: string // 'HH:mm'
  durationMin: number // snapshot at booking time
  priceThb: number // snapshot at booking time
  customerName: string
  customerPhone: string // digits only
  note: string
  status: BookingStatus
  source: 'online' | 'owner'
  createdAt: string // ISO
  cancelledBy?: 'customer' | 'owner'
}

export interface DayHours {
  open: boolean
  start: string
  end: string
  breakStart: string | null
  breakEnd: string | null
}

export interface Availability {
  weekly: DayHours[] // index 0 = Sunday … 6 = Saturday
  closedDates: string[]
}

export interface Settings {
  shopName: string
  address: string
  phone: string
  slotIntervalMin: 15 | 30 | 60
  bufferMin: 0 | 5 | 10 | 15
  maxAdvanceDays: number
  minNoticeHours: number
}

export interface AppState {
  version: 1
  services: Service[]
  bookings: Booking[]
  availability: Availability
  settings: Settings
}

export const OCCUPYING: readonly BookingStatus[] = ['pending', 'confirmed', 'completed']
export const ALL_STATUSES: readonly BookingStatus[] = [
  'pending',
  'confirmed',
  'declined',
  'cancelled',
  'completed',
  'no_show',
]
