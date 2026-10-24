import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { enUS, th as thLocale } from 'date-fns/locale'
import type { BookingStatus, Lang, Service } from '../domain/types'
import { parseDateKey } from '../domain/time'
import { en, th, type MessageKey } from './messages'

const LANG_KEY = 'bookingsaas.lang'

/** Patterns deliberately omit the year. */
export type DatePattern = 'EEE d MMM' | 'EEEE d MMMM' | 'd MMM' | 'EEE' | 'd'

export interface I18n {
  lang: Lang
  setLang(lang: Lang): void
  t(key: MessageKey, vars?: Record<string, string | number>): string
  /** `dateKey` is 'yyyy-MM-dd'. */
  fmtDate(dateKey: string, pattern: DatePattern): string
  fmtPrice(thb: number): string
  fmtDuration(min: number): string
  serviceName(svc: Pick<Service, 'name'>): string
  statusLabel(status: BookingStatus): string
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) === 'th' ? 'th' : 'en'))

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18n>(() => {
    const dict = lang === 'th' ? th : en
    const locale = lang === 'th' ? thLocale : enUS
    const money = new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    })
    const t: I18n['t'] = (key, vars) =>
      (dict[key] ?? en[key] ?? key).replace(/\{(\w+)\}/g, (_, name: string) => String(vars?.[name] ?? `{${name}}`))
    return {
      lang,
      setLang(next) {
        localStorage.setItem(LANG_KEY, next)
        setLangState(next)
      },
      t,
      fmtDate: (dateKey, pattern) => format(parseDateKey(dateKey), pattern, { locale }),
      fmtPrice: (thb) => money.format(thb),
      fmtDuration: (min) => (lang === 'th' ? `${min} นาที` : `${min} min`),
      serviceName: (svc) => svc.name[lang] || svc.name.en,
      statusLabel: (status) => t(`status.${status}`),
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
