import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { canReschedule, canTransition, canMarkOutcome, canCustomerCancel, generateRef, normalizePhone } from '../domain/booking'
import { buildSeed } from '../domain/seed'
import { isSlotFree, type SlotMode } from '../domain/slots'
import type { AppState, Availability, Booking, BookingStatus, Service, Settings } from '../domain/types'
import { loadState, parseState, saveState, STATE_KEY } from './storage'

export interface NewBookingInput {
  serviceId: string
  date: string
  start: string
  customerName: string
  customerPhone: string
  note: string
}

export type CreateResult = { ok: true; booking: Booking } | { ok: false; reason: 'slot_taken' }
export type RescheduleResult = { ok: true } | { ok: false; reason: 'slot_taken' }

export interface AppStore {
  state: AppState
  /** mode 'customer' → Pending/online; mode 'owner' → Confirmed/owner (Walk-in booking). */
  createBooking(input: NewBookingInput, mode: SlotMode): CreateResult
  /** Throws Error('invalid transition') when the move is not allowed. */
  setStatus(id: string, to: BookingStatus, by?: 'customer' | 'owner'): void
  reschedule(id: string, date: string, start: string): RescheduleResult
  /** An empty `svc.id` creates a new Service. */
  saveService(svc: Service): void
  setServiceActive(id: string, active: boolean): void
  saveAvailability(a: Availability): void
  saveSettings(s: Settings): void
  resetDemo(): void
}

const StoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const latest = useRef(state)

  const commit = useCallback((next: AppState) => {
    saveState(next)
    latest.current = next
    setState(next)
  }, [])

  // Another tab (e.g. customer vs owner) wrote new state.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STATE_KEY || !e.newValue) return
      const next = parseState(e.newValue)
      if (!next) return
      latest.current = next
      setState(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const store = useMemo<AppStore>(() => {
    const current = (): AppState => {
      const raw = localStorage.getItem(STATE_KEY)
      const stored = raw ? parseState(raw) : null
      if (stored) latest.current = stored
      return latest.current
    }
    const update = (id: string, fn: (b: Booking) => Booking) => {
      const cur = current()
      commit({ ...cur, bookings: cur.bookings.map((b) => (b.id === id ? fn(b) : b)) })
    }
    const find = (id: string): Booking => {
      const found = current().bookings.find((b) => b.id === id)
      if (!found) throw new Error(`booking ${id} not found`)
      return found
    }

    return {
      state,

      createBooking(input, mode) {
        const cur = current()
        const service = cur.services.find((s) => s.id === input.serviceId)
        if (!service) throw new Error(`service ${input.serviceId} not found`)
        if (!service.active) throw new Error('service_inactive')
        const now = new Date()
        if (!isSlotFree({ state: cur, date: input.date, start: input.start, durationMin: service.durationMin, now, mode })) {
          return { ok: false, reason: 'slot_taken' }
        }
        const booking: Booking = {
          id: `bk-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          ref: generateRef(new Set(cur.bookings.map((b) => b.ref))),
          serviceId: service.id,
          date: input.date,
          start: input.start,
          durationMin: service.durationMin,
          priceThb: service.priceThb,
          customerName: input.customerName.trim(),
          customerPhone: normalizePhone(input.customerPhone),
          note: input.note.trim(),
          status: mode === 'customer' ? 'pending' : 'confirmed',
          source: mode === 'customer' ? 'online' : 'owner',
          createdAt: now.toISOString(),
        }
        commit({ ...cur, bookings: [...cur.bookings, booking] })
        return { ok: true, booking }
      },

      setStatus(id, to, by) {
        const booking = find(id)
        if (!canTransition(booking.status, to)) throw new Error('invalid transition')
        if ((to === 'completed' || to === 'no_show') && !canMarkOutcome(booking, new Date())) throw new Error('invalid transition')
        if (to === 'cancelled' && by === 'customer' && !canCustomerCancel(booking, latest.current.settings, new Date())) throw new Error('invalid transition')
        update(id, (b) => ({ ...b, status: to, ...(to === 'cancelled' ? { cancelledBy: by ?? 'owner' } : {}) }))
      },

      reschedule(id, date, start) {
        const booking = find(id)
        if (!canReschedule(booking)) throw new Error('invalid transition')
        const free = isSlotFree({
          state: latest.current,
          date,
          start,
          durationMin: booking.durationMin,
          now: new Date(),
          mode: 'owner',
          ignoreBookingId: id,
        })
        if (!free) return { ok: false, reason: 'slot_taken' }
        update(id, (b) => ({ ...b, date, start }))
        return { ok: true }
      },

      saveService(svc) {
        const cur = current()
        const clean: Service = {
          ...svc,
          name: { en: svc.name.en.trim(), th: svc.name.th.trim() },
          id: svc.id || `svc-${Date.now()}`,
        }
        const exists = cur.services.some((s) => s.id === clean.id)
        commit({
          ...cur,
          services: exists ? cur.services.map((s) => (s.id === clean.id ? clean : s)) : [...cur.services, clean],
        })
      },

      setServiceActive(id, active) {
        const cur = current()
        commit({ ...cur, services: cur.services.map((s) => (s.id === id ? { ...s, active } : s)) })
      },

      saveAvailability(availability) {
        commit({ ...current(), availability })
      },

      saveSettings(settings) {
        commit({ ...current(), settings })
      },

      resetDemo() {
        commit(buildSeed(new Date()))
      },
    }
  }, [state, commit])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useAppStore(): AppStore {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used inside AppStoreProvider')
  return store
}
