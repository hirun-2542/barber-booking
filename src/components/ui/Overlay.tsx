import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { Button } from './Button'
interface OverlayProps{variant:'dialog'|'drawer';title:string;onClose():void;children:ReactNode;footer?:ReactNode}
const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'
function Overlay({variant,title,onClose,children,footer}:OverlayProps){
 const {t}=useI18n();const panel=useRef<HTMLDivElement>(null);const close=useRef(onClose);close.current=onClose;const titleId=useId()
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;const node=panel.current!;const overlay=node.parentElement!
  const siblings=[...document.body.children].filter(el=>el!==overlay) as HTMLElement[];const old=siblings.map(el=>el.inert);siblings.forEach(el=>el.inert=true)
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden'
  const body=node.querySelector<HTMLElement>('[data-overlay-body]');(body?.querySelector<HTMLElement>(FOCUSABLE)??node.querySelector<HTMLElement>(FOCUSABLE)??node).focus()
  function keys(e:KeyboardEvent){
   const overlays=document.querySelectorAll('.overlay');if(overlays[overlays.length-1]!==overlay)return
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close.current()}
   if(e.key==='Tab'){const items=[...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(!first){e.preventDefault();node.focus();return}if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  }
  document.addEventListener('keydown',keys,true)
  return ()=>{document.removeEventListener('keydown',keys,true);siblings.forEach((el,i)=>el.inert=old[i]);document.body.style.overflow=oldOverflow;if(previous?.isConnected)previous.focus()}
 },[])
 return createPortal(<div className={`overlay overlay-${variant}`} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div ref={panel} className={`overlay-panel ${variant}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><header className="overlay-header od-row"><h2 id={titleId} className="od-fill">{title}</h2><button type="button" className="icon-button od-touch" aria-label={t('common.close')} onClick={onClose}><X size={20} strokeWidth={1.5}/></button></header><div className="overlay-body" data-overlay-body>{children}</div>{footer&&<footer className="overlay-footer od-cluster">{footer}</footer>}</div></div>,document.body)
}
export function Dialog(props:Omit<OverlayProps,'variant'>){return <Overlay variant="dialog" {...props}/>}
export function Drawer(props:Omit<OverlayProps,'variant'>){return <Overlay variant="drawer" {...props}/>}
export function ConfirmDialog({title,body,confirmLabel,onConfirm,onClose}:{title:string;body:string;confirmLabel:string;onConfirm():void;onClose():void}){const {t}=useI18n();return <Dialog title={title} onClose={onClose} footer={<><Button onClick={onClose}>{t('common.cancel')}</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></>}><p className="muted">{body}</p></Dialog>}
