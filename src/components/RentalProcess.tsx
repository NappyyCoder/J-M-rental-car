import { Link } from 'react-router-dom'

const steps = [
  {
    step: '01',
    title: 'Pick your date',
    text: 'Browse our fleet online and filter by package, vehicle type, and availability.',
    cta: { label: 'See what’s available', to: '/vehicles', type: 'link' as const },
  },
  {
    step: '02',
    title: 'Call to reserve',
    text: 'Reach us at 703-563-1125 during business hours to confirm your rental.',
    cta: { label: 'Call 703-563-1125', href: 'tel:+17035631125', type: 'tel' as const },
  },
  {
    step: '03',
    title: 'Pick up & go',
    text: 'Bring your valid license and debit or credit card. Deposits range from $150–$200.',
    cta: { label: 'Location & hours', to: '/contact', type: 'link' as const },
  },
]

const trustItems = [
  { value: '25+', label: 'Minimum age' },
  { value: '$150–$200', label: 'Deposit' },
  { value: 'Mon–Sat', label: 'Open weekly' },
  { value: 'VB Local', label: 'Virginia Beach' },
]

export function RentalProcess() {
  return (
    <section className="section section-tight rental-process rental-process--home" id="how-it-works">
      <div className="container">
        <div className="section-intro center section-intro--tight">
          <p className="label">How it works</p>
          <h2>Get a rental in three steps</h2>
        </div>

        <div className="quick-cta-bar">
          <Link className="btn btn-primary" to="/vehicles">
            View available vehicles
          </Link>
          <a className="btn btn-outline" href="tel:+17035631125">
            Call to reserve
          </a>
          <Link className="btn btn-outline quick-cta-package quick-cta-package--gold" to="/vehicles?package=gold">
            Gold
          </Link>
          <Link className="btn btn-outline quick-cta-package quick-cta-package--silver" to="/vehicles?package=silver">
            Silver
          </Link>
        </div>

        <div className="process-grid">
          {steps.map((item) => (
            <article key={item.step} className="process-card">
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.cta.type === 'tel' ? (
                <a className="btn btn-sm btn-outline process-card-cta" href={item.cta.href}>
                  {item.cta.label}
                </a>
              ) : (
                <Link className="btn btn-sm btn-outline process-card-cta" to={item.cta.to}>
                  {item.cta.label}
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="trust-bar-inline" aria-label="Rental highlights">
          {trustItems.map((item) => (
            <div key={item.label} className="trust-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
