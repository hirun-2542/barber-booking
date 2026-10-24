import type { ReactNode } from 'react'
export function PageHead({title,description,action}:{title:string;description:string;action?:ReactNode}) {
  return <div className="page-heading od-row-top"><div className="od-field od-fill"><h1>{title}</h1><p>{description}</p></div>{action && <div className="od-fixed">{action}</div>}</div>
}
