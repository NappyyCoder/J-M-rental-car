import { Reveal } from './Reveal'
import { DEPOSIT_RANGE } from '../lib/contact'

const items = [
  { value: '25+', label: 'Minimum age' },
  { value: DEPOSIT_RANGE, label: 'Deposit range' },
  { value: 'Mon to Sat', label: 'Open weekly' },
  { value: 'Local', label: 'Virginia Beach' },
]

export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Rental highlights">
      <div className="container trust-bar-inner">
        {items.map((item, i) => (
          <Reveal key={item.label} as="div" className="trust-item" delay={i * 70}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
