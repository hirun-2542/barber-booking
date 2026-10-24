import { useEffect, useState, type CSSProperties } from 'react'
import { addDays, differenceInCalendarDays, isValid } from 'date-fns'
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { dateKey, parseDateKey } from '../../domain/time'
import { getAvailableSlots, type SlotMode } from '../../domain/slots'
import { useAppStore } from '../../store/AppStore'
import { useNow } from '../../store/useNow'
import { useI18n } from '../../i18n/I18nProvider'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/Misc'
import { Field } from '../ui/Form'
import { DatePicker } from '../ui/DatePicker'

const DAYS_PER_PAGE = 5

export function DateSlots({ date, start, onDate, onStart, durationMin, mode = 'customer', ignoreBookingId }: {
  date: string; start: string; onDate(d: string): void; onStart(s: string): void
  durationMin: number; mode?: SlotMode; ignoreBookingId?: string
}) {
  const { state } = useAppStore()
  const { t, fmtDate } = useI18n()
  const now = useNow()
  const today = dateKey(now)
  const latest = dateKey(addDays(now, state.settings.maxAdvanceDays))
  const [page, setPage] = useState(() => date && isValid(parseDateKey(date))
    ? Math.floor(Math.max(0, differenceInCalendarDays(parseDateKey(date), now)) / DAYS_PER_PAGE) : 0)
  const [timeLimit, setTimeLimit] = useState(50)
  const slots = date ? getAvailableSlots({ state, date, durationMin, now, mode, ignoreBookingId }) : []
  const days = mode === 'customer' ? Array.from({ length: state.settings.maxAdvanceDays + 1 }, (_, i) => {
    const key = dateKey(addDays(now, i))
    const closed = !state.availability.weekly[parseDateKey(key).getDay()].open || state.availability.closedDates.includes(key)
    const available = getAvailableSlots({ state, date: key, durationMin, now, mode, ignoreBookingId })
    return { key, closed, count: available.length }
  }) : []
  const pageCount = Math.max(1, Math.ceil(days.length / DAYS_PER_PAGE))
  const visiblePage = Math.min(page, pageCount - 1)
  const visibleDays = days.slice(visiblePage * DAYS_PER_PAGE, (visiblePage + 1) * DAYS_PER_PAGE)
  const firstAvailable = days.find(day => day.count > 0)
  const nextAvailable = days.find(day => day.key > date && day.count > 0)
  const selectedDay = days.find(day => day.key === date)
  const emptyTitle = mode === 'customer' && !date ? t('cal.dateRequired')
    : selectedDay?.closed ? t('common.closed') : t('common.noTimes')

  useEffect(() => {
    if (start && !slots.includes(start)) onStart('')
  }, [slots.join(','), start, onStart])

  useEffect(() => {
    if (mode !== 'customer') return
    const index = days.findIndex(day => day.key === date)
    setPage(current => index >= 0 ? Math.floor(index / DAYS_PER_PAGE) : Math.min(current, pageCount - 1))
  }, [date, today, latest, mode])

  useEffect(() => { setTimeLimit(50) }, [date, durationMin])

  function chooseDate(value: string) {
    if (mode === 'customer') {
      const index = days.findIndex(day => day.key === value)
      if (index >= 0) setPage(Math.floor(index / DAYS_PER_PAGE))
    }
    onDate(value)
    if (mode === 'owner' || value !== date) onStart('')
  }

  return <div className="od-stack section-gap">
    {mode === 'customer' ? <div className="customer-date-picker od-stack">
      <div className="customer-date-heading od-row">
        <h2 className="od-fill">{t('c.pickDate')}</h2>
        <Button variant="ghost" disabled={!firstAvailable || date === firstAvailable.key}
          onClick={() => firstAvailable && chooseDate(firstAvailable.key)}>{t('cal.earliestDate')}</Button>
      </div>
      <div className="customer-date-nav">
        <Button disabled={visiblePage === 0} aria-label={t('cal.prevDates')}
          onClick={() => setPage(current => Math.max(0, current - 1))}>
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
        </Button>
        <p className="customer-date-range od-nowrap" aria-live="polite" aria-atomic="true">
          {visibleDays.length > 0 && (visibleDays.length === 1 ? fmtDate(visibleDays[0].key, 'd MMM')
            : `${fmtDate(visibleDays[0].key, 'd MMM')} – ${fmtDate(visibleDays[visibleDays.length - 1].key, 'd MMM')}`)}
        </p>
        <Button disabled={visiblePage === pageCount - 1} aria-label={t('cal.nextDates')}
          onClick={() => setPage(current => Math.min(pageCount - 1, current + 1))}>
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
        </Button>
      </div>
      <div className="customer-date-grid od-grid" style={{ '--od-cols': Math.min(DAYS_PER_PAGE, days.length) } as CSSProperties}
        role="group" aria-label={t('c.pickDate')}>
        {visibleDays.map(day => <button type="button" key={day.key}
          className={`day-button od-cell${date === day.key ? ' selected' : ''}`}
          disabled={day.count === 0} aria-pressed={date === day.key}
          aria-label={t('cal.dateAvailability', { date: fmtDate(day.key, 'EEEE d MMMM'), availability: day.closed
            ? t('common.closed') : day.count === 0 ? t('common.full') : t('cal.availableCount', { count: day.count }) })}
          onClick={() => chooseDate(day.key)}>
          <span className="day-name">{day.key === today ? t('d.calendar.today') : fmtDate(day.key, 'EEE')}</span>
          <span className="day-number od-row"><span>{fmtDate(day.key, 'd')}</span>
            {date === day.key && <Check size={12} strokeWidth={1.5} aria-hidden />}</span>
          <span className="day-availability od-nowrap">{day.closed ? t('common.closed') : day.count === 0
            ? t('common.full') : t('cal.dateFree', { count: day.count })}</span>
        </button>)}
      </div>
      <details className="customer-date-jump">
        <summary className="od-row"><CalendarDays size={20} strokeWidth={1.5} aria-hidden />
          <span className="od-fill">{t('cal.otherDate')}</span><ChevronDown className="customer-date-chevron" size={20} strokeWidth={1.5} aria-hidden /></summary>
        <Field label={t('cal.chooseDate')} hint={t('cal.dateLimit', { date: fmtDate(latest, 'd MMM') })}>
          {props => <DatePicker {...props} min={today} max={latest} value={date} onChange={chooseDate} />}
        </Field>
      </details>
    </div> : <Field label={t('common.date')}>
      {props => <DatePicker {...props} min={today} value={date} onChange={chooseDate} />}
    </Field>}

    <div className={`od-stack small-gap${mode === 'customer' ? ' customer-time-picker' : ''}`}>
      <div className="section-heading od-row">
        <h2 className="od-fill">{t('c.availableTimes')}</h2>
        {mode === 'owner' && date && <span className="muted text-xs">{fmtDate(date, 'd MMM')}</span>}
      </div>
      {mode === 'customer' && date && <p className="customer-selected-date" aria-live="polite">
        {t('cal.selectedDate', { date: fmtDate(date, 'EEEE d MMMM') })}
      </p>}
      {slots.length > 0 ? <>
        <div className={`slot-grid${mode === 'customer' ? ' customer-slot-grid' : ''}`} role="group" aria-label={t('e.chooseSlot')}>
          {(mode === 'customer' ? slots.slice(0, timeLimit) : slots).map(slot => <button type="button" key={slot}
            aria-pressed={start === slot} className={`slot${slot === start ? ' selected' : ''}`} onClick={() => onStart(slot)}>
            {mode === 'customer' && start === slot && <Check size={16} strokeWidth={1.5} aria-hidden />}
            <span className="od-nowrap">{slot}</span>
          </button>)}
        </div>
        {mode === 'customer' && slots.length > timeLimit && <Button onClick={() => setTimeLimit(limit => limit + 50)}>{t('cal.moreTimes')}</Button>}
      </> : <EmptyState icon={<CalendarDays size={24} strokeWidth={1.5} aria-hidden />}
        title={mode === 'customer' ? emptyTitle : t('common.noTimes')} action={mode === 'customer' ? <div className="od-stack small-gap">
          <p>{t(firstAvailable ? 'e.tryDay' : 'cal.noDates')}</p>
          {nextAvailable ? <Button onClick={() => chooseDate(nextAvailable.key)}>{t(date ? 'cal.nextAvailableDate' : 'cal.earliestDate')}</Button>
            : firstAvailable ? <Button onClick={() => chooseDate(firstAvailable.key)}>{t('cal.earliestDate')}</Button>
              : <a className="text-link" href={`tel:${state.settings.phone}`}>{t('c.callShop', { phone: state.settings.phone })}</a>}
        </div> : <p className="field-hint">{t('e.tryDay')}</p>} />}
      <p className="field-hint">{t('e.timeHint')}</p>
    </div>
  </div>
}
