import { CalendarCheck, CalendarDays, Clock, List, Scissors, Settings, Users, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'
import { LangToggle } from '../components/LangToggle'
import { BookingDrawer } from '../components/booking/BookingDrawer'
import { useI18n } from '../i18n/I18nProvider'
import { useAppStore } from '../store/AppStore'
import { useNow } from '../store/useNow'
import { dateKey } from '../domain/time'
const nav=[['today','nav.today',CalendarCheck],['calendar','nav.calendar',CalendarDays],['bookings','nav.bookings',List],['customers','nav.customers',Users],['services','nav.services',Scissors],['availability','nav.availability',Clock],['settings','nav.settings',Settings]] as const
export function DashboardLayout() {
  const {t,fmtDate}=useI18n();const {state}=useAppStore();const now=useNow();const pending=state.bookings.filter(b=>b.status==='pending').length
  const items=nav.map(([path,key,Icon])=><NavLink key={path} to={path} className={({isActive})=>`nav-item od-row${isActive?' current':''}`}><Icon size={20} strokeWidth={1.5} aria-hidden/><span className="od-fill">{t(key)}</span>{path==='bookings' && pending>0 && <span className="nav-count" aria-label={t('layout.pendingCount',{count:pending})}>{pending}</span>}</NavLink>)
  return <div className="dashboard-shell"><aside className="sidebar"><Link to="/" className="brand side-brand od-row"><span className="brand-symbol"><Scissors size={22} strokeWidth={1.5}/></span><span className="od-field"><strong>{state.settings.shopName}</strong><span className="eyebrow">{t('e.owner')}</span></span></Link><nav aria-label={t('layout.mainNav')} className="side-nav od-stack">{items.slice(0,4)}<span className="nav-divider"/>{items.slice(4)}</nav><div className="sidebar-foot od-stack"><Link to="/" className="text-link"><ArrowLeft size={16}/>{t('e.backShop')}</Link><p>{t('e.demoLocal')}</p></div></aside><div className="dashboard-main"><header className="workspace-bar od-row"><Link to="/" className="mobile-brand">{state.settings.shopName}</Link><span className="workspace-date od-fill">{fmtDate(dateKey(now),'EEEE d MMMM')}</span><a href="#/book" target="_blank" rel="noopener" className="text-link book-page-link">{t('layout.viewBookingPage')}<ArrowUpRight size={16}/></a><LangToggle/></header><nav className="mobile-nav od-rail" aria-label={t('layout.mainNav')}>{items}</nav><main className="dashboard-content"><Outlet/></main><footer className="dashboard-footer"><span>{state.settings.shopName}</span><span>{t('e.demoLocal')}</span></footer></div><BookingDrawer/></div>
}
