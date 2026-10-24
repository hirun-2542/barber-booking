import { cx } from './cx'

interface SwitchProps {
  checked: boolean
  onChange(next: boolean): void
  /** Visible text when on / off — state is never conveyed by colour alone. */
  on: string
  off: string
  ariaLabel: string
}

export function Switch({ checked, onChange, on, off, ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md text-[13px] font-medium"
    >
      <span
        aria-hidden
        className={cx(
          'relative h-4 w-7 shrink-0 rounded-full border transition-colors duration-150',
          checked ? 'border-accent bg-accent' : 'border-line bg-surface',
        )}
      >
        <span
          className={cx(
            'absolute top-[2px] size-2.5 rounded-full transition-[left] duration-150',
            checked ? 'left-[14px] bg-white' : 'left-[2px] bg-muted',
          )}
        />
      </span>
      <span className={checked ? 'text-ink' : 'text-muted'}>{checked ? on : off}</span>
    </button>
  )
}
