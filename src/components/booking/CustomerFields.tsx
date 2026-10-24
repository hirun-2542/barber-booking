import { useRef } from 'react'
import type { MessageKey } from '../../i18n/messages'
import { Field,Input,Textarea } from '../ui/Form'
import { useI18n } from '../../i18n/I18nProvider'
import { isValidPhone,normalizePhone } from '../../domain/booking'
export interface CustomerValues{name:string;phone:string;note:string}
export type CustomerErrors=Partial<Record<keyof CustomerValues,string>>
export function validateCustomer(v:CustomerValues,t:(key:MessageKey)=>string):CustomerErrors{
 const e:CustomerErrors={};if(v.name.trim().length<2||v.name.trim().length>60)e.name=t('common.errorName');if(!isValidPhone(normalizePhone(v.phone)))e.phone=t('common.errorPhone');if(v.note.length>200)e.note=t('e.noteError');return e
}
export function CustomerFields({value,onChange,errors,onBlur}:{value:CustomerValues;onChange(value:CustomerValues):void;errors:CustomerErrors;onBlur(key:keyof CustomerValues):void}){
 const {t}=useI18n();const container=useRef<HTMLDivElement>(null)
 return <div ref={container} className="od-stack section-gap">{Object.values(errors).filter(Boolean).length>1&&<div className="form-alert" role="alert"><div><p>{t('e.formError')}</p><ul>{Object.entries(errors).filter(([,v])=>v).map(([k,v])=><li key={k}><a href="#root" onClick={e=>{e.preventDefault();container.current?.querySelector<HTMLElement>(`[name="${k==='name'?'customerName':k==='phone'?'customerPhone':'note'}"]`)?.focus()}}>{v}</a></li>)}</ul></div></div>}<Field label={`${t('common.name')} *`} error={errors.name}>{p=><Input {...p} name="customerName" autoComplete="name" value={value.name} maxLength={60} onChange={e=>onChange({...value,name:e.target.value})} onBlur={()=>onBlur('name')}/>}</Field><Field label={`${t('common.phone')} *`} error={errors.phone}>{p=><Input {...p} name="customerPhone" type="tel" inputMode="tel" autoComplete="tel" value={value.phone} maxLength={20} placeholder="081-234-5678" onChange={e=>onChange({...value,phone:e.target.value})} onBlur={()=>onBlur('phone')}/>}</Field><Field label={t('common.note')} optional error={errors.note} hint={t('c.noteCounter',{count:value.note.length})}>{p=><Textarea {...p} name="note" value={value.note} maxLength={200} rows={3} onChange={e=>onChange({...value,note:e.target.value})} onBlur={()=>onBlur('note')}/>}</Field></div>
}
