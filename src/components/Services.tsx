import { Link } from 'react-router-dom'
import { ADDRESS_LINE1, ADDRESS_LINE2, WEEKLY_RATES_NOTE } from '../lib/contact'
import { PageFoot } from './PageFoot'

const services = [
  {
    title: 'Daily rentals',
    text: 'Rent by the day for work, errands, or travel. Pick up and return during our business hours.',
  },
  {
    title: 'Online availability',
    text: 'Browse Gold and Silver cars on our site and check open dates before you call.',
  },
  {
    title: 'Weekly rates & specials',
    text: WEEKLY_RATES_NOTE,
  },
  {
    title: 'Extra driver',
    text: 'Add a second driver for $50. They must have a valid license.',
  },
]

type Props = {
  showIntro?: boolean
  variant?: 'default' | 'page'
}

export function Services({ showIntro = true, variant = 'default' }: Props) {
  const isPage = variant === 'page'

  return (
    <section className={`section services${isPage ? ' services--page' : ''}`} id="services">
      <div className="container">
        {isPage ? (
          <>
            <div className="services-panel">
              <div className="services-panel-head">
                <h2>What we offer</h2>
                <p>Day rentals with clear pricing and simple rules. No hidden fees.</p>
              </div>
              <div className="services-grid services-grid--page">
                {services.map((s) => (
                  <article key={s.title} className="service-card">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </article>
                ))}
              </div>
              <div className="services-panel-meta">
                <div>
                  <p className="services-panel-meta-label">Pickup location</p>
                  <p className="services-panel-meta-value">
                    {ADDRESS_LINE1}, {ADDRESS_LINE2}
                  </p>
                </div>
                <Link className="btn btn-outline btn-sm" to="/vehicles">
                  See available cars
                </Link>
              </div>
            </div>
            <PageFoot
              title="Ready to book?"
              text="Call during business hours. Debit or credit card required at pickup."
            />
          </>
        ) : (
          <>
            {showIntro && (
              <div className="section-intro center">
                <p className="label">Our services</p>
                <h2>What we offer</h2>
                <p>Day rentals with clear pricing and simple rules. No hidden fees in the fine print.</p>
              </div>
            )}
            <div className="services-grid">
              {[...services, {
                title: 'Pick up in Virginia Beach',
                text: `${ADDRESS_LINE1}. Open Monday through Friday 9:30 to 5:30, Saturday 10 to 2.`,
              }].map((s) => (
                <article key={s.title} className="service-card">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
