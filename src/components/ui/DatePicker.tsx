import { useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns'
import { enUS, th as thLocale } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { dateKey, parseDateKey } from '../../domain/time'
import { useI18n } from '../../i18n/I18nProvider'

interface Props {
  id?: string
  value: string // 'yyyy-MM-dd' or ''
  onChange(value: string): void
  min?: string
  max?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/** Month-grid picker that follows the UI language (native date inputs follow the browser locale). */
export function DatePicker({ id, value, onChange, min, max, ...aria }: Props) {
  const { t, lang, fmtDate } = useI18n()
  const locale = lang === 'th' ? thLocale : enUS
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(parseDateKey(value || min || dateKey(new Date()))))

  const days = eachDayOfInterval({
    start: startOfWeek(month, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })
  const prevOk = !min || startOfMonth(month) > parseDateKey(min)
  const nextOk = !max || endOfMonth(month) < parseDateKey(max)

  return (
    <div className="date-picker">
      <button
        id={id}
        type="button"
        className="control date-picker-trigger"
        aria-expanded={open}
        {...aria}
        onClick={() => {
          if (!open && value) setMonth(startOfMonth(parseDateKey(value)))
          setOpen(!open)
        }}
      >
        <CalendarDays size={18} strokeWidth={1.5} aria-hidden />
        <span>{value ? fmtDate(value, 'EEE d MMM') : t('cal.pickDate')}</span>
      </button>
      {open && (
        <div
          className="date-picker-panel"
          role="group"
          aria-label={t('cal.chooseDate')}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation()
              setOpen(false)
            }
          }}
        >
          <div className="date-picker-head">
            <button type="button" className="icon-button" aria-label={t('cal.prevMonth')} disabled={!prevOk} onClick={() => setMonth(addMonths(month, -1))}>
              <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
            </button>
            <strong aria-live="polite">{format(month, 'LLLL', { locale })}</strong>
            <button type="button" className="icon-button" aria-label={t('cal.nextMonth')} disabled={!nextOk} onClick={() => setMonth(addMonths(month, 1))}>
              <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="date-picker-grid">
            {days.slice(0, 7).map((d) => (
              <span key={d.getTime()} className="date-picker-dow" aria-hidden>
                {format(d, 'EEEEE', { locale })}
              </span>
            ))}
            {days.map((d) => {
              const key = dateKey(d)
              return (
                <button
                  key={key}
                  type="button"
                  className="date-picker-day"
                  data-outside={!isSameMonth(d, month)}
                  aria-pressed={key === value}
                  aria-label={fmtDate(key, 'EEEE d MMMM')}
                  disabled={Boolean((min && key < min) || (max && key > max))}
                  onClick={() => {
                    onChange(key)
                    setOpen(false)
                  }}
                >
                  {format(d, 'd')}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
