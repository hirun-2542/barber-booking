import type { BookingStatus } from '../../domain/types'
import { useI18n } from '../../i18n/I18nProvider'
export function StatusBadge({status}:{status:BookingStatus}){const {statusLabel}=useI18n();return <span className={`status status-${status}`}><span className="status-mark" aria-hidden/>{statusLabel(status)}</span>}
