import { useState } from 'react'
import { Plus,Search } from 'lucide-react'
import { PageHead } from '../../components/PageHead'
import { Button } from '../../components/ui/Button'
import { Field,Input,Select } from '../../components/ui/Form'
import { Segmented,EmptyState } from '../../components/ui/Misc'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { NewBookingDialog } from '../../components/booking/BookingDialogs'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
import { useNow } from '../../store/useNow'
import { bookingStartDate } from '../../domain/time'
import { ALL_STATUSES } from '../../domain/types'
import { formatPhone } from '../../domain/booking'
import { useBookingLink } from '../../components/useBookingLink'
export default function Bookings(){
 const {state}=useAppStore();const {t,fmtDate,fmtPrice,statusLabel,serviceName}=useI18n();const now=useNow();const {openBooking}=useBookingLink();const [tab,setTab]=useState<'upcoming'|'past'|'all'>('upcoming');const [status,setStatus]=useState('all');const [query,setQuery]=useState('');const [newBooking,setNewBooking]=useState(false);const [page,setPage]=useState(1)
 const q=query.toLowerCase().trim();const rows=state.bookings.filter(b=>(tab==='all'||(tab==='upcoming'?bookingStartDate(b)>=now:bookingStartDate(b)<now))&&(status==='all'||b.status===status)&&(!q||`${b.customerName} ${b.customerPhone} ${formatPhone(b.customerPhone)} ${b.ref}`.toLowerCase().includes(q))).sort((a,b)=>tab==='past'?+bookingStartDate(b)-+bookingStartDate(a):+bookingStartDate(a)-+bookingStartDate(b))
 const shown=rows.slice(0,page*30)
 return <><PageHead title={t('nav.bookings')} description={t('e.bookingsIntro')} action={<Button variant="primary" onClick={()=>setNewBooking(true)}><Plus size={16}/>{t('d.newBooking')}</Button>}/><div className="toolbar"><Segmented value={tab} onChange={v=>{setTab(v);setPage(1)}} ariaLabel={t('m.tabs')} options={[{value:'upcoming',label:t('m.tabUpcoming')},{value:'past',label:t('m.tabPast')},{value:'all',label:t('common.all')}]}/><Field label={t('m.filterStatus')}>{p=><Select {...p} value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="all">{t('m.allStatuses')}</option>{ALL_STATUSES.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}</Select>}</Field><Field label={t('common.search')} className="search-field">{p=><Input {...p} type="search" placeholder={t('m.searchBookings')} value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}}/>}</Field></div><p className="list-note">{t('e.results',{count:rows.length})}</p>
 <div className="table-panel">{rows.length?<table className="data-table"><thead><tr><th>{t('common.customer')}</th><th>{t('common.date')}</th><th>{t('common.service')}</th><th>{t('common.price')}</th><th>{t('common.status')}</th></tr></thead><tbody>{shown.map(b=><tr key={b.id} className="click-row" onClick={()=>openBooking(b.id)}><td><button className="booking-name" aria-label={t('m.openBooking',{ref:b.ref})} onClick={e=>{e.stopPropagation();openBooking(b.id)}}>{b.customerName}</button><span className="table-secondary mono">{formatPhone(b.customerPhone)}</span></td><td data-label={t('common.date')}><span>{fmtDate(b.date,'d MMM')}</span><span className="table-secondary mono">{b.start}</span></td><td data-label={t('common.service')}>{state.services.find(s=>s.id===b.serviceId)?serviceName(state.services.find(s=>s.id===b.serviceId)!):'—'}<span className="table-secondary mono">{b.ref}</span></td><td data-label={t('common.price')} className="od-nowrap">{fmtPrice(b.priceThb)}</td><td data-label={t('common.status')}><StatusBadge status={b.status}/></td></tr>)}</tbody></table>:<EmptyState icon={<Search size={24}/>} title={t('m.noBookings')} action={<Button onClick={()=>{setQuery('');setStatus('all');setTab('all');setPage(1)}}>{t('common.clearFilters')}</Button>}/>}</div>{rows.length>shown.length&&<div className="mt-6"><Button onClick={()=>setPage(p=>p+1)}>{t('common.continue')} ({shown.length}/{rows.length})</Button></div>}{newBooking&&<NewBookingDialog onClose={()=>setNewBooking(false)}/>}</>
}
