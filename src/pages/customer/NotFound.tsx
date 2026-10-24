import { useNavigate } from 'react-router'
import { SearchX } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useI18n } from '../../i18n/I18nProvider'

export default function NotFound() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <SearchX aria-hidden size={24} strokeWidth={1.5} className="text-muted" />
      <h1 className="text-[22px] leading-[30px] font-semibold">{t('common.notFoundTitle')}</h1>
      <p className="text-[15px] text-muted">{t('common.notFoundBody')}</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        {t('common.backHome')}
      </Button>
    </div>
  )
}
