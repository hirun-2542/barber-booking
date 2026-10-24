import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cx } from './cx'
export function Card({className,children}:{className?:string;children:ReactNode}){return <div className={cx('panel',className)}>{children}</div>}
export function Stat({label,value,sub}:{label:string;value:ReactNode;sub?:string}){return <div className="metric od-stat"><p className="metric-label">{label}</p><p className="metric-value od-nowrap">{value}</p>{sub && <p className="metric-note">{sub}</p>}</div>}
export function EmptyState({icon,title,action}:{icon?:ReactNode;title:string;action?:ReactNode}){return <div className="empty od-stack">{icon || <Check size={24} strokeWidth={1.5} aria-hidden/>}<p>{title}</p>{action}</div>}
export function Segmented<V extends string>({value,onChange,options,ariaLabel,className}:{value:V;onChange(value:V):void;options:ReadonlyArray<{value:V;label:string}>;ariaLabel:string;className?:string}){return <div role="radiogroup" aria-label={ariaLabel} className={cx('segmented',className)}>{options.map(o=><button key={o.value} type="button" role="radio" aria-checked={o.value===value} onClick={()=>onChange(o.value)} className={o.value===value?'selected':''}>{o.label}</button>)}</div>}
