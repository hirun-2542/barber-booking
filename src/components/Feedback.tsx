import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { MessageKey } from '../i18n/messages'
const FeedbackContext = createContext<(key: MessageKey, error?: boolean) => void>(() => {})
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const [message, setMessage] = useState<{key: MessageKey; error: boolean} | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  function notify(key: MessageKey, error = false) { clearTimeout(timer.current); setMessage({key,error}); timer.current = setTimeout(() => setMessage(null), 4200) }
  return <FeedbackContext.Provider value={notify}>{children}<div className="toast-region" aria-live="polite" aria-atomic="true">{message && <div className="toast">{message.error ? <AlertCircle size={18}/> : <Check size={18}/>}<span>{t(message.key)}</span></div>}</div></FeedbackContext.Provider>
}
export const useFeedback = () => useContext(FeedbackContext)
