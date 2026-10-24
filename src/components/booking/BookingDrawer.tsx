import { useEffect } from 'react'
import { Phone } from 'lucide-react'
import { Drawer } from '../ui/Overlay'
import { StatusBadge } from '../ui/StatusBadge'
import { BookingActions } from './BookingActions'
import { BookingSummary } from '../../pages/customer/BookingSummary'
import { useBookingLink } from '../useBookingLink'
import { useAppStore } from '../../store/AppStore'
import { useI18n } from '../../i18n/I18nProvider'
import { formatPhone } from '../../domain/booking'
export function BookingDrawer(){
 const {bookingId,closeBooking}=useBookingLink();const {state}=useAppStore();const {t}=useI18n();const booking=state.bookings.find(b=>b.id===bookingId)
 useEffect(()=>{if(bookingId&&!booking)closeBooking()},[bookingId,booking,closeBooking])
 if(!booking)return null
 return <Drawer title={t('e.bookingDetails')} onClose={closeBooking}><div className="od-stack section-gap"><div className="od-row"><p className="drawer-ref mono od-fill">{booking.ref}</p><StatusBadge status={booking.status}/></div><div className="drawer-customer od-stack"><h3>{booking.customerName}</h3><a href={`tel:${booking.customerPhone}`} className="text-link"><Phone size={16}/>{formatPhone(booking.customerPhone)}</a></div><BookingSummary service={state.services.find(s=>s.id===booking.serviceId)} {...booking}/><div className="od-row"><span className="muted text-sm od-fill">{t('d.drawer.source')}</span><span className="text-sm">{t(booking.source==='online'?'common.sourceOnline':'common.sourceOwner')}</span></div>{booking.cancelledBy&&<p className="field-hint">{t(booking.cancelledBy==='customer'?'d.drawer.cancelledByCustomer':'d.drawer.cancelledByOwner')}</p>}<BookingActions booking={booking}/></div></Drawer>
}
