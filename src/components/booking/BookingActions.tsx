import { useState } from 'react'
import { Check,ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/Overlay'
import { RescheduleDialog } from './BookingDialogs'
import { canMarkOutcome,canReschedule } from '../../domain/booking'
import type { Booking,BookingStatus } from '../../domain/types'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
import { useNow } from '../../store/useNow'
import { useFeedback } from '../Feedback'
export function BookingActions({booking,compact=false}:{booking:Booking;compact?:boolean}){
 const {t}=useI18n();const {setStatus}=useAppStore();const now=useNow();const notify=useFeedback();const [confirm,setConfirm]=useState<'declined'|'cancelled'|null>(null);const [move,setMove]=useState(false)
 function update(to:BookingStatus){try{setStatus(booking.id,to,'owner');notify('e.recorded')}catch(e){notify(e instanceof Error&&e.message==='invalid transition'?'e.changeFailed':'e.storageError',true)}setConfirm(null)}
 if(!canReschedule(booking))return null
 const past=canMarkOutcome(booking,now)
 return <><div className="action-buttons od-cluster">
 {booking.status==='pending'?<><Button size={compact?'sm':'md'} variant="primary" onClick={()=>update('confirmed')}><Check size={14}/>{t('d.action.accept')}</Button><Button size={compact?'sm':'md'} onClick={()=>setConfirm('declined')}>{t('d.action.decline')}</Button></>:<><Button size={compact?'sm':'md'} onClick={()=>update('completed')} disabled={!past} title={!past?t('d.action.outcomeLocked'):undefined}>{t('d.action.markCompleted')}</Button><Button size={compact?'sm':'md'} onClick={()=>update('no_show')} disabled={!past} title={!past?t('d.action.outcomeLocked'):undefined}>{t('d.action.markNoShow')}</Button></>}
 {!compact&&<><Button onClick={()=>setMove(true)}>{t('d.action.reschedule')}<ArrowRight size={14}/></Button><Button variant="danger" onClick={()=>setConfirm('cancelled')}>{t('d.action.cancel')}</Button></>}
 </div>{booking.status==='confirmed'&&!past&&!compact&&<p className="field-hint mt-3">{t('d.action.outcomeLocked')}</p>}
 {confirm&&<ConfirmDialog title={t(confirm==='declined'?'d.confirm.declineTitle':'d.confirm.cancelTitle')} body={t(confirm==='declined'?'d.confirm.declineBody':'d.confirm.cancelBody')} confirmLabel={t(confirm==='declined'?'d.action.decline':'d.action.cancel')} onClose={()=>setConfirm(null)} onConfirm={()=>update(confirm)}/>}{move&&<RescheduleDialog booking={booking} onClose={()=>setMove(false)}/>}</>
}
