import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  label: string
  title: string
  lead?: string
  children?: ReactNode
}

export function PageHero({ label, title, lead, children }: Props) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <Reveal>
          <p className="label">{label}</p>
          <h1>{title}</h1>
          {lead && <p className="page-hero-lead">{lead}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  )
}
