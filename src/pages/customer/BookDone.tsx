import { useState } from 'react'
import { useNavigate,useParams } from 'react-router'
import { Check,Copy,ArrowRight,Info } from 'lucide-react'
import { BookingSummary } from './BookingSummary'
import NotFound from './NotFound'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
export default function BookDone(){
 const {ref}=useParams();const {state}=useAppStore();const {t}=useI18n();const navigate=useNavigate();const [copied,setCopied]=useState(false);const [copyHint,setCopyHint]=useState(false);const booking=state.bookings.find(b=>b.ref===ref)
 if(!booking)return <NotFound/>
 async function copy(){try{await navigator.clipboard.writeText(booking!.ref);setCopied(true)}catch{setCopyHint(true)}}
 return <div className="od-stack section-gap"><div className="booking-head od-stack"><StatusBadge status={booking.status}/><h1>{t('c.requestSent')}</h1><p>{t('e.confirmation')}</p></div><div className="reference-box"><p className="eyebrow">{t('common.ref')}</p><span className="code">{booking.ref}</span><Button size="sm" onClick={copy}>{copied?<Check size={16}/>:<Copy size={16}/>} {t(copied?'e.copied':'e.copy')}</Button>{copyHint&&<p className="field-hint mt-3">{t('e.copyFallback')}</p>}</div><p className="muted">{t('c.saveCode')}</p><BookingSummary service={state.services.find(s=>s.id===booking.serviceId)} {...booking}/><div className="info-note"><Info size={18}/><p>{t('e.requestSentHelp')}</p></div><Button variant="primary" block onClick={()=>navigate(`/my-booking?ref=${booking.ref}`)}>{t('c.checkMyBooking')}<ArrowRight size={16}/></Button><Button variant="ghost" onClick={()=>navigate('/')}>{t('common.backHome')}</Button></div>
}
