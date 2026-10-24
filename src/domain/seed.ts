import { addDays } from 'date-fns'
import { generateRef } from './booking'
import { bookingStartDate, dateKey } from './time'
import type { AppState, Booking, DayHours, Service } from './types'

const WEEKDAY_TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30']
const WEEKEND_TIMES = ['09:30', '11:00', '14:00', '15:30']

const CUSTOMERS = [
  ['Somchai K.', '0812345678'],
  ['Nattapong S.', '0823456789'],
  ['James W.', '0834567890'],
  ['Pimchanok R.', '0845678901'],
  ['Anan T.', '0856789012'],
  ['Mali P.', '0867890123'],
  ['Daniel H.', '0878901234'],
  ['Kittipong L.', '0889012345'],
  ['Sarah M.', '0890123456'],
  ['Thanakorn B.', '0801234567'],
] as const

const SERVICES: Service[] = [
  { id: 'svc-1', name: { en: 'Haircut', th: 'ตัดผม' }, durationMin: 45, priceThb: 350, active: true },
  { id: 'svc-2', name: { en: 'Skin fade', th: 'ตัดสกินเฟด' }, durationMin: 60, priceThb: 450, active: true },
  { id: 'svc-3', name: { en: 'Beard trim', th: 'แต่งหนวด' }, durationMin: 30, priceThb: 200, active: true },
  {
    id: 'svc-4',
    name: { en: 'Haircut & beard', th: 'ตัดผม + แต่งหนวด' },
    durationMin: 75,
    priceThb: 500,
    active: true,
  },
  { id: 'svc-5', name: { en: 'Kids cut', th: 'ตัดผมเด็ก' }, durationMin: 30, priceThb: 250, active: true },
  {
    id: 'svc-6',
    name: { en: 'Hot towel shave', th: 'โกนหนวดผ้าร้อน' },
    durationMin: 45,
    priceThb: 300,
    active: false,
  },
]

/** Deterministic demo data relative to `now`: today is always open and fully populated. */
export function buildSeed(now: Date): AppState {
  const closedWeekday = addDays(now, 3).getDay()
  const weekly: DayHours[] = Array.from({ length: 7 }, (_, day) => {
    const weekend = day === 0 || day === 6
    return {
      open: day !== closedWeekday,
      start: weekend ? '09:00' : '10:00',
      end: weekend ? '18:00' : '20:00',
      breakStart: '13:00',
      breakEnd: '14:00',
    }
  })
  const closedDates = [dateKey(addDays(now, 9))]

  const activeServices = SERVICES.filter((s) => s.active)
  const refs = new Set<string>()
  const bookings: Booking[] = []
  let futureSeen = 0

  for (let d = -14; d <= 7; d++) {
    const day = addDays(now, d)
    const key = dateKey(day)
    if (!weekly[day.getDay()].open || closedDates.includes(key)) continue
    const times = day.getDay() === 0 || day.getDay() === 6 ? WEEKEND_TIMES : WEEKDAY_TIMES
    const count = d === 0 ? times.length : Math.min(2 + (Math.abs(d) % 4), times.length)

    for (const start of times.slice(0, count)) {
      const i = bookings.length
      const service = activeServices[i % activeServices.length]
      const [customerName, customerPhone] = CUSTOMERS[i % CUSTOMERS.length]
      const ref = generateRef(refs)
      refs.add(ref)
      const booking: Booking = {
        id: `bk-${i + 1}`,
        ref,
        serviceId: service.id,
        date: key,
        start,
        durationMin: service.durationMin,
        priceThb: service.priceThb,
        customerName,
        customerPhone,
        note: '',
        status: 'confirmed',
        source: i % 5 === 0 ? 'owner' : 'online',
        createdAt: addDays(bookingStartDate({ date: key, start }), -2).toISOString(),
      }
      if (bookingStartDate(booking) < now) {
        if (i % 9 === 4) {
          booking.status = 'cancelled'
          booking.cancelledBy = 'customer'
        } else if (i % 7 === 3) booking.status = 'no_show'
        else booking.status = 'completed'
      } else {
        futureSeen++
        if (futureSeen === 2) booking.status = 'declined'
        else if (i % 3 === 0) booking.status = 'pending'
      }
      bookings.push(booking)
    }
  }

  // Keep the latest already-started booking today Confirmed so "Needs action" has a row.
  const startedToday = bookings.filter((b) => b.date === dateKey(now) && bookingStartDate(b) < now)
  if (startedToday.length > 0) {
    const last = startedToday[startedToday.length - 1]
    last.status = 'confirmed'
    delete last.cancelledBy
  }

  return {
    version: 1,
    services: SERVICES.map((s) => ({ ...s, name: { ...s.name } })),
    bookings,
    availability: { weekly, closedDates },
    settings: {
      shopName: 'Ash & Oak Barber',
      address: '12 Soi Ari 1, Phaya Thai, Bangkok',
      phone: '0987654321',
      slotIntervalMin: 30,
      bufferMin: 0,
      maxAdvanceDays: 14,
      minNoticeHours: 1,
    },
  }
}
