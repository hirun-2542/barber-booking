import { common } from './common'
import { customer } from './customer'
import { dashboard } from './dashboard'
import { manage } from './manage'
import { editorial } from './editorial'
import { calendar } from './calendar'

const slices = [common, customer, dashboard, manage, editorial, calendar]

export const en: Record<string, string> = Object.assign({}, ...slices.map((s) => s.en))
export const th: Record<string, string> = Object.assign({}, ...slices.map((s) => s.th))

export type MessageKey =
  | keyof typeof common.en
  | keyof typeof customer.en
  | keyof typeof dashboard.en
  | keyof typeof manage.en
  | keyof typeof editorial.en
  | keyof typeof calendar.en
