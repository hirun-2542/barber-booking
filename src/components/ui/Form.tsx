import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { fromMin } from '../../domain/time'
import { cx } from './cx'

export interface FieldControlProps {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

interface FieldProps {
  label: string
  error?: string | null
  hint?: string
  optional?: boolean
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

/** Visible label + control + error text (icon + text, never colour alone). */
export function Field({ label, error, hint, optional, className, children }: FieldProps) {
  const id = useId()
  const { t } = useI18n()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cx('field od-field', className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">({t('common.optional')})</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle aria-hidden size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const CONTROL = 'control'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(CONTROL, 'h-11', className)} {...rest} />
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(CONTROL, 'h-11 pr-8', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(CONTROL, 'control-textarea', className)} {...rest} />
}

const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => fromMin(6 * 60 + i * 30)) // 06:00 – 23:30

/** 24-hour time picker; native time inputs follow the browser locale and show AM/PM. */
export function TimeSelect({ value, ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> & { value: string }) {
  const options = value && !TIME_OPTIONS.includes(value) ? [...TIME_OPTIONS, value].sort() : TIME_OPTIONS
  return (
    <Select value={value} {...rest}>
      {options.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </Select>
  )
}
