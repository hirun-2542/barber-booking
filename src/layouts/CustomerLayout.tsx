import { Link, Outlet, useLocation } from 'react-router'
import { Scissors, ArrowUpRight } from 'lucide-react'
import { LangToggle } from '../components/LangToggle'
import { formatPhone } from '../domain/booking'
import { useAppStore } from '../store/AppStore'
import { useI18n } from '../i18n/I18nProvider'
export function CustomerLayout() {
  const {settings}=useAppStore().state; const {t}=useI18n();const {pathname}=useLocation()
  return <div className="customer-shell"><header className="customer-header od-row"><Link to="/" className="brand od-row od-fill"><span className="brand-symbol"><Scissors size={20} strokeWidth={1.5}/></span><span>{settings.shopName}</span></Link><LangToggle/></header><main className={`customer-main ${pathname==='/'?'landing-main':''}`}><Outlet/></main><footer className="customer-footer od-stack"><div className="od-row"><span className="footer-brand od-fill">{settings.shopName}</span><a href={`tel:${settings.phone}`} className="text-link od-nowrap">{formatPhone(settings.phone)}<ArrowUpRight size={14}/></a></div><p>{settings.address}</p><p className="demo-note">{t('c.demoNote')}</p></footer></div>
}
