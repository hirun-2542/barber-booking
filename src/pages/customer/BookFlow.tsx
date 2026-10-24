import { useRef,useState } from 'react'
import { useNavigate } from 'react-router'
import { addDays } from 'date-fns'
import { ArrowLeft,ArrowRight,Check,Info } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Misc'
import { DateSlots } from '../../components/booking/DateSlots'
import { CustomerFields,validateCustomer,type CustomerValues,type CustomerErrors } from '../../components/booking/CustomerFields'
import { BookingSummary } from './BookingSummary'
import { getAvailableSlots } from '../../domain/slots'
import { dateKey } from '../../domain/time'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
export default function BookFlow(){
 const {state,createBooking}=useAppStore();const {t,serviceName,fmtDuration,fmtPrice}=useI18n();const navigate=useNavigate()
 const [step,setStep]=useState(1);const [serviceId,setServiceId]=useState('');const [date,setDate]=useState('');const [start,setStart]=useState('');const [value,setValue]=useState<CustomerValues>({name:'',phone:'',note:''});const [errors,setErrors]=useState<CustomerErrors>({});const [message,setMessage]=useState('');const [submitted,setSubmitted]=useState(false);const submitting=useRef(false);const box=useRef<HTMLDivElement>(null)
 const service=state.services.find(s=>s.id===serviceId);const active=state.services.filter(s=>s.active)
 const titles=[t('c.chooseService'),t('c.dateTime'),t('c.details'),t('c.review')];const subtitles=[t('e.serviceIntro'),t('e.timeIntro'),t('e.detailsIntro'),t('e.reviewIntro')]
 function go(n:number){setStep(n);window.scrollTo({top:0,behavior:'auto'})}
 function blur(key:keyof CustomerValues){setErrors(prev=>({...prev,[key]:validateCustomer(value,t)[key]}))}
 function next(){
  if(step===1&&service){if(!date){setStart('');for(let i=0;i<=state.settings.maxAdvanceDays;i++){const d=dateKey(addDays(new Date(),i));if(getAvailableSlots({state,date:d,durationMin:service.durationMin,now:new Date(),mode:'customer'}).length){setDate(d);break}}}go(2)}
  else if(step===2&&date&&start)go(3)
  else if(step===3){const e=validateCustomer(value,t);setErrors(e);if(Object.keys(e).length){queueMicrotask(()=>box.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return}go(4)}
 }
 function submit(){if(submitting.current||!service)return;submitting.current=true;setSubmitted(true);setMessage('');try{const result=createBooking({serviceId,date,start,customerName:value.name,customerPhone:value.phone,note:value.note},'customer');if(result.ok){navigate(`/book/done/${result.booking.ref}`);return}setMessage(t('common.slotTaken'));setStart('');go(2)}catch(e){setMessage(t(e instanceof Error&&e.message==='service_inactive'?'e.serviceInactive':'e.storageError'));if(e instanceof Error&&e.message==='service_inactive')go(1)}submitting.current=false;setSubmitted(false)}
 return <div ref={box}><div className="step-top"><div className="od-row"><button type="button" className="text-link od-fill" onClick={()=>step===1?navigate('/'):go(step-1)}><ArrowLeft size={16}/>{t('common.back')}</button><p className="eyebrow">{t('c.stepOf',{n:step})}</p></div><div className="step-progress" aria-hidden>{[1,2,3,4].map(n=><span key={n} className={n<=step?'filled':''}/>)}</div></div><div className="booking-head od-stack"><h1>{titles[step-1]}</h1><p>{subtitles[step-1]}</p></div>{message&&<div className="form-alert mb-6" role="alert"><Info size={18}/><p>{message}</p></div>}
 {step===1&&(active.length?<div className="od-stack small-gap" role="radiogroup" aria-label={t('c.chooseService')}>{active.map(s=><button key={s.id} type="button" className={`service-option${serviceId===s.id?' selected':''}`} role="radio" aria-checked={serviceId===s.id} onClick={()=>{if(serviceId!==s.id){setServiceId(s.id);setDate('');setStart('')}setMessage('')}}><span className="option-check" aria-hidden>{serviceId===s.id&&<Check size={12}/>}</span><span className="od-field od-fill"><strong>{serviceName(s)}</strong><span className="muted">{fmtDuration(s.durationMin)}</span></span><span className="mono od-nowrap">{fmtPrice(s.priceThb)}</span></button>)}</div>:<EmptyState title={t('c.noServices')} action={<a className="text-link" href={`tel:${state.settings.phone}`}>{t('c.callShop',{phone:state.settings.phone})}</a>}/>)}
 {step===2&&service&&<DateSlots date={date} start={start} onDate={setDate} onStart={setStart} durationMin={service.durationMin}/>}
 {step===3&&<div className="od-stack section-gap"><CustomerFields value={value} onChange={setValue} errors={errors} onBlur={blur}/></div>}
 {step===4&&service&&<div className="od-stack section-gap"><BookingSummary service={service} date={date} start={start} durationMin={service.durationMin} priceThb={service.priceThb} customerName={value.name} customerPhone={value.phone} note={value.note}/><div className="info-note"><Info size={18}/><p>{t('c.confirmNote')}</p></div></div>}
 <div className="book-actions od-row">{step>1&&<Button onClick={()=>go(step-1)}>{t('common.back')}</Button>}{step<4?<Button variant="primary" disabled={step===1?!service:step===2?!start:false} onClick={next}>{t('common.continue')}<ArrowRight size={16}/></Button>:<Button variant="primary" disabled={submitted} onClick={submit}>{t('c.requestBooking')}<ArrowRight size={16}/></Button>}</div></div>
}
