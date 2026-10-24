import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
export default function Landing(){
 const {state}=useAppStore();const {t,serviceName,fmtDuration,fmtPrice}=useI18n()
 return <div className="od-stack large-gap">
  <section className="landing-intro od-stack"><p className="eyebrow">{t('e.request')}</p><h1>{t('e.brandLine')}</h1><p>{t('e.landingIntro')}</p></section>
  <nav className="landing-actions od-stack"><Link to="/book" className="landing-cta primary"><span>{t('c.bookAsCustomer')}</span><ArrowRight size={20} strokeWidth={1.5}/></Link><Link to="/dashboard/today" className="landing-cta"><span>{t('c.openDashboard')}</span><ArrowUpRight size={20} strokeWidth={1.5}/></Link></nav>
  <section><div className="section-heading od-row"><h2 className="od-fill">{t('nav.services')}</h2><span className="eyebrow">{state.services.filter(s=>s.active).length.toString().padStart(2,'0')}</span></div>{state.services.filter(s=>s.active).map(s=><div className="service-preview od-row" key={s.id}><div className="od-field od-fill"><strong>{serviceName(s)}</strong><span className="muted">{fmtDuration(s.durationMin)}</span></div><span className="mono od-nowrap">{fmtPrice(s.priceThb)}</span></div>)}</section>
  <Link to="/my-booking" className="text-link">{t('c.checkMyBooking')}<ArrowRight size={16}/></Link>
 </div>
}
