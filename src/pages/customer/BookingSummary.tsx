import { formatPhone, normalizePhone } from '../../domain/booking'
import { fromMin,toMin } from '../../domain/time'
import type { Service } from '../../domain/types'
import { useI18n,type DatePattern } from '../../i18n/I18nProvider'
interface Props{service?:Service;date:string;start:string;durationMin:number;priceThb:number;customerName:string;customerPhone:string;note?:string;ref?:string;datePattern?:DatePattern}
export function BookingSummary({service,date,start,durationMin,priceThb,customerName,customerPhone,note,ref,datePattern='EEE d MMM'}:Props){
 const {t,fmtDate,fmtPrice,fmtDuration,serviceName}=useI18n()
 const rows=[...(ref?[[t('common.ref'),ref,true]]:[]),[t('common.service'),service?serviceName(service):'—',false],[t('m.duration'),fmtDuration(durationMin),false],[t('common.date'),fmtDate(date,datePattern),false],[t('common.time'),`${start}–${fromMin(toMin(start)+durationMin)}`,true],[t('common.name'),customerName,false],[t('common.phone'),formatPhone(normalizePhone(customerPhone)),true],[t('common.price'),fmtPrice(priceThb),false]]
 return <dl className="summary">{rows.map(([label,value,mono])=><div className="summary-row" key={String(label)}><dt>{label}</dt><dd className={mono?'mono od-nowrap':''}>{value}</dd></div>)}{note&&<div className="summary-row summary-note"><dt>{t('common.note')}</dt><dd>{note}</dd></div>}</dl>
}
