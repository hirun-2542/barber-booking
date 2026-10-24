import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
  block?: boolean
}

export function Button({ variant = 'secondary', size = 'md', block, className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(
        'btn', `btn-${variant}`, size === 'sm' && 'btn-sm', block && 'btn-block',
        className,
      )}
      {...rest}
    />
  )
}
