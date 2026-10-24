import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

/** The booking drawer is driven by `?booking=<id>` on any dashboard route. */
export function useBookingLink() {
  const [params, setParams] = useSearchParams()
  const openBooking = useCallback(
    (id: string) => {
      const next = new URLSearchParams(params)
      next.set('booking', id)
      setParams(next)
    },
    [params, setParams],
  )
  const closeBooking = useCallback(() => {
    const next = new URLSearchParams(params)
    next.delete('booking')
    setParams(next, { replace: true })
  }, [params, setParams])
  return { bookingId: params.get('booking'), openBooking, closeBooking }
}
