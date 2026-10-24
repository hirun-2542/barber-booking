import { useRef,useState } from 'react'
import { Info } from 'lucide-react'
import { Dialog } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { Field,Select } from '../ui/Form'
import { EmptyState } from '../ui/Misc'
import { DateSlots } from './DateSlots'
import { CustomerFields,validateCustomer,type CustomerValues,type CustomerErrors } from './CustomerFields'
import type { Booking } from '../../domain/types'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
import { dateKey } from '../../domain/time'
import { useFeedback } from '../Feedback'
export function NewBookingDialog({onClose,initialDate,initialStart}:{onClose():void;initialDate?:string;initialStart?:string}){
 const {state,createBooking}=useAppStore();const {t,serviceName}=useI18n();const notify=useFeedback();const services=state.services.filter(s=>s.active)
 const [serviceId,setServiceId]=useState(services[0]?.id??'');const [date,setDate]=useState(initialDate??dateKey(new Date()));const [start,setStart]=useState(initialStart??'');const [value,setValue]=useState<CustomerValues>({name:'',phone:'',note:''});const [errors,setErrors]=useState<CustomerErrors>({});const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const locked=useRef(false);const form=useRef<HTMLDivElement>(null)
 const service=services.find(s=>s.id===serviceId)
 function blur(k:keyof CustomerValues){setErrors(e=>({...e,[k]:validateCustomer(value,t)[k]}))}
 function save(){const e=validateCustomer(value,t);setErrors(e);if(Object.keys(e).length){queueMicrotask(()=>form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return}if(!service||!date||!start||locked.current)return;locked.current=true;setBusy(true);try{const r=createBooking({serviceId,date,start,customerName:value.name,customerPhone:value.phone,note:value.note},'owner');if(r.ok){notify('e.created');onClose();return}setMessage(t('common.slotTaken'));setStart('')}catch(e){setMessage(t(e instanceof Error&&e.message==='service_inactive'?'e.serviceInactive':'e.storageError'))}locked.current=false;setBusy(false)}
 return <Dialog title={t('d.dialog.newBooking')} onClose={onClose} footer={<><Button onClick={onClose}>{t('common.cancel')}</Button><Button variant="primary" disabled={!service||!date||!start||busy} onClick={save}>{t('d.dialog.create')}</Button></>}><div ref={form} className="od-stack section-gap">{!service?<EmptyState title={t('d.dialog.noServices')}/>:<><Field label={t('common.service')}>{p=><Select {...p} value={serviceId} onChange={e=>{setServiceId(e.target.value);setStart('')}}>{services.map(s=><option key={s.id} value={s.id}>{serviceName(s)}</option>)}</Select>}</Field><DateSlots mode="owner" date={date} start={start} onDate={setDate} onStart={setStart} durationMin={service.durationMin}/><CustomerFields value={value} onChange={setValue} errors={errors} onBlur={blur}/></>}{message&&<div className="form-alert" role="alert"><Info size={18}/><p>{message}</p></div>}</div></Dialog>
}
export function RescheduleDialog({booking,onClose}:{booking:Booking;onClose():void}){
 const {t}=useI18n();const {reschedule}=useAppStore();const notify=useFeedback();const [date,setDate]=useState(booking.date);const [start,setStart]=useState(booking.start);const [error,setError]=useState('');const [busy,setBusy]=useState(false)
 function save(){setBusy(true);try{const r=reschedule(booking.id,date,start);if(r.ok){notify('e.moved');onClose();return}setError(t('common.slotTaken'));setStart('')}catch{setError(t('e.changeFailed'))}setBusy(false)}
 return <Dialog title={t('d.dialog.reschedule')} onClose={onClose} footer={<><Button onClick={onClose}>{t('common.cancel')}</Button><Button variant="primary" disabled={!date||!start||busy} onClick={save}>{t('common.save')}</Button></>}><div className="od-stack section-gap"><DateSlots mode="owner" date={date} start={start} onDate={setDate} onStart={setStart} durationMin={booking.durationMin} ignoreBookingId={booking.id}/>{error&&<div className="form-alert" role="alert">{error}</div>}</div></Dialog>
}
