import { Reveal } from './Reveal'

const items = [
  { value: '25+', label: 'Minimum age' },
  { value: '$150–$200', label: 'Deposit range' },
  { value: 'Mon–Sat', label: 'Open weekly' },
  { value: 'VB Local', label: 'Virginia Beach' },
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
