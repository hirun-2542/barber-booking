import { useState,type FormEvent } from 'react'
import { Link,useSearchParams } from 'react-router'
import { ArrowRight,Info } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Field,Input } from '../../components/ui/Form'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ConfirmDialog } from '../../components/ui/Overlay'
import { BookingSummary } from './BookingSummary'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
import { useNow } from '../../store/useNow'
import { canCustomerCancel,formatPhone,isValidPhone,normalizePhone } from '../../domain/booking'
import { useFeedback } from '../../components/Feedback'
const statusKeys={pending:'c.statusPending',confirmed:'c.statusConfirmed',declined:'c.statusDeclined',cancelled:'c.statusCancelled',completed:'c.statusCompleted',no_show:'c.statusNoShow'} as const
export default function MyBooking(){
 const [params]=useSearchParams();const {state,setStatus}=useAppStore();const {t}=useI18n();const now=useNow();const notify=useFeedback()
 const [ref,setRef]=useState(params.get('ref')??'');const [phone,setPhone]=useState('');const [errors,setErrors]=useState<{ref?:string;phone?:string}>({});const [result,setResult]=useState('');const [message,setMessage]=useState('');const [confirm,setConfirm]=useState(false)
 const booking=state.bookings.find(b=>b.id===result&&b.customerPhone===normalizePhone(phone)&&b.ref===ref.trim().toUpperCase())
 function blur(which:'ref'|'phone'){setErrors(e=>({...e,[which]:which==='ref'?(/^[A-HJ-NP-Z2-9]{6}$/.test(ref.toUpperCase())?undefined:t('e.refError')):isValidPhone(normalizePhone(phone))?undefined:t('common.errorPhone')}))}
 function find(e:FormEvent){e.preventDefault();const errs={ref:/^[A-HJ-NP-Z2-9]{6}$/.test(ref.trim().toUpperCase())?undefined:t('e.refError'),phone:isValidPhone(normalizePhone(phone))?undefined:t('common.errorPhone')};setErrors(errs);setMessage('');setResult('');if(errs.ref||errs.phone)return;const found=state.bookings.find(b=>b.ref===ref.trim().toUpperCase()&&b.customerPhone===normalizePhone(phone));if(found)setResult(found.id);else setMessage(t('c.noMatch'))}
 function cancel(){if(!booking)return;try{setStatus(booking.id,'cancelled','customer');notify('e.recorded')}catch{notify('e.changeFailed',true)}setConfirm(false)}
 return <div className="od-stack section-gap"><div className="booking-head od-stack"><p className="eyebrow">{t('e.customer')}</p><h1>{t('c.checkMyBooking')}</h1><p>{t('c.findIntro')}</p></div><form className="od-stack section-gap" onSubmit={find} noValidate><Field label={t('common.ref')} error={errors.ref}>{p=><Input {...p} className="mono" autoCapitalize="characters" autoComplete="off" maxLength={6} value={ref} onChange={e=>{setRef(e.target.value.toUpperCase());setResult('')}} onBlur={()=>blur('ref')}/>}</Field><Field label={t('common.phone')} error={errors.phone}>{p=><Input {...p} type="tel" autoComplete="tel" placeholder="081-234-5678" value={phone} onChange={e=>{setPhone(e.target.value);setResult('')}} onBlur={()=>blur('phone')}/>}</Field><Button variant="primary" type="submit" block>{t('c.find')}<ArrowRight size={16}/></Button>{message&&<p className="form-alert" role="alert">{message}</p>}</form>
 {booking&&<section className="od-stack section-gap" aria-live="polite"><div className="panel panel-padding od-stack small-gap"><StatusBadge status={booking.status}/><h2>{t(statusKeys[booking.status])}</h2></div><BookingSummary service={state.services.find(s=>s.id===booking.serviceId)} {...booking}/>{canCustomerCancel(booking,state.settings,now)?<Button variant="danger" onClick={()=>setConfirm(true)}>{t('c.cancelBooking')}</Button>:(booking.status==='pending'||booking.status==='confirmed')&&<div className="info-note"><Info size={18}/><p>{t('c.cancelWindow',{hours:state.settings.minNoticeHours,phone:formatPhone(state.settings.phone)})} <a href={`tel:${state.settings.phone}`} className="text-link">{formatPhone(state.settings.phone)}</a></p></div>}{booking.status==='declined'&&<Link className="text-link" to="/book">{t('c.bookAgain')}<ArrowRight size={16}/></Link>}</section>}{confirm&&<ConfirmDialog title={t('c.cancelTitle')} body={t('c.cancelBody')} confirmLabel={t('c.cancelBooking')} onClose={()=>setConfirm(false)} onConfirm={cancel}/>}</div>
}
