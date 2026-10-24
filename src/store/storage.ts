import { buildSeed } from '../domain/seed'
import type { AppState } from '../domain/types'

export const STATE_KEY = 'bookingsaas.state.v1'

export function parseState(raw: string): AppState | null {
  try {
    const value = JSON.parse(raw) as Partial<AppState> | null
    return value && value.version === 1 && Array.isArray(value.bookings) && Array.isArray(value.services)
      ? (value as AppState)
      : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export function loadState(): AppState {
  const raw = localStorage.getItem(STATE_KEY)
  const stored = raw ? parseState(raw) : null
  if (stored) return stored
  const seed = buildSeed(new Date())
  saveState(seed)
  return seed
}
