import { Fragment, useState } from 'react'
import { addDays, addWeeks, isValid, startOfWeek } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageHead } from '../../components/PageHead'
import { Button } from '../../components/ui/Button'
import { DatePicker } from '../../components/ui/DatePicker'
import { EmptyState } from '../../components/ui/Misc'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { NewBookingDialog } from '../../components/booking/BookingDialogs'
import { useAppStore } from '../../store/AppStore'
import { useNow } from '../../store/useNow'
import { useI18n } from '../../i18n/I18nProvider'
import { dateKey, parseDateKey, toMin, fromMin } from '../../domain/time'
import { getAvailableSlots } from '../../domain/slots'
import { OCCUPYING } from '../../domain/types'
import { useBookingLink } from '../../components/useBookingLink'

export default function Calendar() {
  const { state } = useAppStore()
  const { t, fmtDate, serviceName, statusLabel } = useI18n()
  const { openBooking } = useBookingLink()
  const now = useNow()
  const today = dateKey(now)
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))
  const [visibleCount, setVisibleCount] = useState(50)
  const [create, setCreate] = useState<{ date: string; start?: string } | null>(null)

  const days = Array.from({ length: 7 }, (_, i) => dateKey(addDays(week, i)))
  const bookingsByDay = days.map(date => state.bookings.filter(b => b.date === date))
  const weekBookings = bookingsByDay.flat()
  const openHours = state.availability.weekly.filter(h => h.open)
  // Preserve bookings after shop hours change, including those outside the usual grid.
  const start = Math.floor(Math.min(540, ...openHours.map(h => toMin(h.start)), ...weekBookings.map(b => toMin(b.start))) / 30) * 30
  const end = Math.ceil(Math.max(1200, ...openHours.map(h => toMin(h.end)), ...weekBookings.map(b => toMin(b.start) + b.durationMin)) / 30) * 30
  const times = Array.from({ length: Math.ceil((end - start) / 30) }, (_, i) => start + i * 30)
  const activeServices = state.services.filter(s => s.active)
  const defaultService = activeServices[0]
  // Offer the same valid slots as the service initially selected in the booking dialog.
  const slotsByDay = days.map(date => defaultService
    ? getAvailableSlots({ state, date, durationMin: defaultService.durationMin, now, mode: 'owner' })
    : [])

  const dayBookings = state.bookings.filter(b => b.date === selectedDate)
    .sort((a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt))
  const hours = state.availability.weekly[parseDateKey(selectedDate).getDay()]
  const dayClosed = !hours.open || state.availability.closedDates.includes(selectedDate)
  const hasAvailability = !dayClosed && selectedDate >= today && activeServices.some(service =>
    getAvailableSlots({ state, date: selectedDate, durationMin: service.durationMin, now, mode: 'owner' }).length > 0,
  )
  const blockedReason = selectedDate < today ? t('cal.pastHint')
    : dayClosed ? t('cal.closedHint')
      : !activeServices.length ? t('d.dialog.noServices')
        : !hasAvailability ? t('cal.fullHint') : ''

  function chooseDate(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isValid(parseDateKey(date))) return
    setSelectedDate(date)
    setVisibleCount(50)
    setWeek(startOfWeek(parseDateKey(date), { weekStartsOn: 1 }))
  }

  function moveWeek(amount: number) {
    setVisibleCount(50)
    setWeek(current => addWeeks(current, amount))
    setSelectedDate(current => dateKey(addWeeks(parseDateKey(current), amount)))
  }

  return <div className="calendar-page">
    <PageHead title={t('nav.calendar')} description={t('cal.intro')} action={
      <Button variant="primary" onClick={() => setCreate({ date: today })}>
        <Plus size={16} strokeWidth={1.5} aria-hidden />{t('d.newBooking')}
      </Button>
    } />

    <div className="calendar-mobile">
      <div className="calendar-date-controls">
        <label htmlFor="calendar-selected-date">{t('cal.chooseDate')}</label>
        <div className="calendar-day-nav">
          <Button aria-label={t('cal.prevDay')} onClick={() => chooseDate(dateKey(addDays(parseDateKey(selectedDate), -1)))}>
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
          </Button>
          <DatePicker id="calendar-selected-date" value={selectedDate} onChange={chooseDate} />
          <Button aria-label={t('cal.nextDay')} onClick={() => chooseDate(dateKey(addDays(parseDateKey(selectedDate), 1)))}>
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
          </Button>
        </div>
      </div>

      <section className="calendar-agenda" aria-labelledby="calendar-agenda-title">
        <div className="calendar-agenda-heading od-row-top">
          <div className="od-field od-fill" aria-live="polite" aria-atomic="true">
            <h2 id="calendar-agenda-title">{fmtDate(selectedDate, 'EEE d MMM')}</h2>
            <p className="muted">{t(dayBookings.length === 1 ? 'cal.oneBooking' : 'cal.bookingCount', { count: dayBookings.length })}</p>
          </div>
          <Button disabled={selectedDate === today} onClick={() => chooseDate(today)}>{t('d.calendar.today')}</Button>
        </div>
        <div className="calendar-agenda-hours od-field">
          <p>{dayClosed ? t('common.closed') : t('cal.hours', { start: hours.start, end: hours.end })}</p>
          {!dayClosed && hours.breakStart && hours.breakEnd &&
            <p>{t('cal.breakHours', { start: hours.breakStart, end: hours.breakEnd })}</p>}
        </div>
        <Button variant="primary" block disabled={!hasAvailability}
          aria-describedby={blockedReason ? 'calendar-add-hint' : undefined}
          onClick={() => setCreate({ date: selectedDate })}>
          <Plus size={20} strokeWidth={1.5} aria-hidden />{t('d.newBooking')}
        </Button>
        {blockedReason && <p id="calendar-add-hint" className="calendar-add-hint">{blockedReason}</p>}

        {dayBookings.length ? <ul className="calendar-agenda-list">
          {dayBookings.slice(0, visibleCount).map(booking => {
            const service = state.services.find(s => s.id === booking.serviceId)
            const endTime = fromMin(toMin(booking.start) + booking.durationMin)
            return <li key={booking.id}>
              <button type="button" className="calendar-agenda-booking"
                aria-label={t('cal.openBooking', { start: booking.start, end: endTime, name: booking.customerName, status: statusLabel(booking.status) })}
                onClick={() => openBooking(booking.id)}>
                <span className="calendar-agenda-time od-field mono">
                  <strong className="od-nowrap">{booking.start}</strong>
                  <span className="muted od-nowrap">{endTime}</span>
                </span>
                <span className="calendar-agenda-detail od-field">
                  <strong className="od-clamp-2">{booking.customerName}</strong>
                  <span className="calendar-agenda-service od-clamp-2">{service ? serviceName(service) : t('common.service')}</span>
                  <StatusBadge status={booking.status} />
                </span>
                <ChevronRight size={20} strokeWidth={1.5} className="calendar-agenda-chevron" aria-hidden />
              </button>
            </li>
          })}
        </ul> : <EmptyState icon={<CalendarDays size={24} strokeWidth={1.5} aria-hidden />}
          title={t('cal.emptyTitle')} action={<p className="calendar-empty-hint">{t(hasAvailability ? 'cal.emptyHint' : 'cal.emptyUnavailable')}</p>} />}
        {dayBookings.length > visibleCount && <Button block className="calendar-load-more"
          onClick={() => setVisibleCount(count => count + 50)}>{t('cal.loadMore')}</Button>}
      </section>
    </div>

    <div className="calendar-desktop">
      <div className="week-toolbar od-row">
        <div className="od-row">
          <Button aria-label={t('d.calendar.prevWeek')} onClick={() => moveWeek(-1)}><ChevronLeft size={18} strokeWidth={1.5} aria-hidden /></Button>
          <Button aria-label={t('d.calendar.nextWeek')} onClick={() => moveWeek(1)}><ChevronRight size={18} strokeWidth={1.5} aria-hidden /></Button>
          <Button onClick={() => chooseDate(today)}>{t('d.calendar.today')}</Button>
        </div>
        <strong>{fmtDate(days[0], 'd MMM')} – {fmtDate(days[6], 'd MMM')}</strong>
      </div>
      <div className="calendar-scroll" tabIndex={0} role="region" aria-label={t('d.calendar.grid')}>
        <div className="calendar-grid">
          <div className="calendar-corner" />
          {days.map(date => <div key={date} className={`calendar-day od-cell${date === today ? ' today' : ''}`}>
            <span>{fmtDate(date, 'EEE')}</span><strong>{fmtDate(date, 'd')}</strong>
          </div>)}
          {times.map(min => <Fragment key={min}>
            <div className="calendar-time">{fromMin(min)}</div>
            {days.map((date, index) => {
              const dayHours = state.availability.weekly[addDays(week, index).getDay()]
              const closed = !dayHours.open || state.availability.closedDates.includes(date)
                || min < toMin(dayHours.start) || min >= toMin(dayHours.end)
              const breakTime = !!(dayHours.breakStart && dayHours.breakEnd
                && min < toMin(dayHours.breakEnd) && min + 30 > toMin(dayHours.breakStart))
              const bookings = bookingsByDay[index]
              const starts = bookings.filter(b => toMin(b.start) >= min && toMin(b.start) < min + 30)
              const ongoing = bookings.some(b => OCCUPYING.includes(b.status)
                && toMin(b.start) < min && toMin(b.start) + b.durationMin > min)
              const freeStart = slotsByDay[index].find(slot => toMin(slot) >= min && toMin(slot) < min + 30)
              return <div key={date} className={`calendar-cell${(closed || breakTime) && !freeStart && !starts.length ? ' closed' : ''}`}>
                {starts.map(booking => <button key={booking.id} type="button" className={`calendar-block ${booking.status}`}
                  aria-label={t('d.calendar.block', { time: booking.start, name: booking.customerName, status: statusLabel(booking.status) })}
                  onClick={() => openBooking(booking.id)}>
                  <span className="od-truncate">{booking.customerName}</span>
                  <span className="mono od-nowrap">{booking.start}–{fromMin(toMin(booking.start) + booking.durationMin)}</span>
                  <StatusBadge status={booking.status} />
                </button>)}
                {freeStart ? <button type="button" className="calendar-add"
                  aria-label={t('d.calendar.newBookingAt', { date: fmtDate(date, 'd MMM'), time: freeStart })}
                  onClick={() => setCreate({ date, start: freeStart })}>
                  <Plus size={16} strokeWidth={1.5} aria-hidden /><span className="mono od-nowrap">{freeStart}</span>
                </button> : !starts.length && <span className="calendar-unavailable text-center">
                  {breakTime ? t('m.break') : closed ? (min === start ? t('common.closed') : '—') : ongoing ? t('cal.busy') : '—'}
                </span>}
              </div>
            })}
          </Fragment>)}
        </div>
      </div>
      <div className="calendar-legend od-cluster">
        <StatusBadge status="pending" /><StatusBadge status="confirmed" /><StatusBadge status="completed" />
        <span className="field-hint">{t('m.break')} / {t('common.closed')}</span>
      </div>
    </div>
    {create && <NewBookingDialog onClose={() => setCreate(null)} initialDate={create.date} initialStart={create.start} />}
  </div>
}
