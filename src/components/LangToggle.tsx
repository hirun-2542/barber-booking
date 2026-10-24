import { useI18n } from '../i18n/I18nProvider'
import { Segmented } from './ui/Misc'

export function LangToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <Segmented
      ariaLabel={t('layout.language')}
      value={lang}
      onChange={setLang}
      options={[
        { value: 'en', label: 'EN' },
        { value: 'th', label: 'TH' },
      ]}
    />
  )
}
