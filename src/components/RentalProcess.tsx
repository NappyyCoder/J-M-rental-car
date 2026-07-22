import { Link } from 'react-router-dom'
import { DEPOSIT_RANGE, PHONE_DISPLAY } from '../lib/contact'
import { PACKAGE_INFO, PACKAGE_ORDER } from '../lib/packages'

const aboutPoints = [
  {
    title: 'Local and accountable',
    text: 'We are right here in Virginia Beach. When you call, you talk to us directly.',
  },
  {
    title: 'Straightforward terms',
    text: 'We explain age, deposit, and payment rules up front. No surprises.',
  },
  {
    title: 'Gold and Silver options',
    text: 'Pick a premium Gold car or a practical Silver rental that fits your budget.',
  },
]

const steps = [
  {
    step: '1',
    title: 'Pick your date',
    text: 'Choose the day you need a car and browse what is open below.',
  },
  {
    step: '2',
    title: 'Call to book',
    text: `Call ${PHONE_DISPLAY} during business hours to hold your car.`,
  },
  {
    step: '3',
    title: 'Pick up',
    text: `Bring your license and a debit or credit card. Deposits are usually ${DEPOSIT_RANGE}.`,
  },
]

const trustItems = [
  { value: '25+', label: 'Must be 25 or older' },
  { value: DEPOSIT_RANGE, label: 'Typical deposit' },
  { value: 'Mon to Sat', label: 'Open most days' },
  { value: 'Local', label: 'Virginia Beach' },
]

type Props = {
  variant?: 'default' | 'home'
}

export function RentalProcess({ variant = 'default' }: Props) {
  const isHome = variant === 'home'

  if (isHome) {
    return (
      <section className="section home-main" id="about">
        <div className="container">
          <div className="home-panel">
            <div className="home-panel-head">
              <p className="label">About J&amp;M Car Rental</p>
              <h2>A local rental shop you can trust</h2>
              <p>
                J&amp;M Car Rental LLC offers clean, dependable cars for day to day use and short
                trips in Virginia Beach. Browse what is open online, call us to reserve, and pick
                up during our business hours.
              </p>
            </div>

            <div className="home-about-grid">
              {aboutPoints.map((item) => (
                <article key={item.title} className="home-about-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="home-panel-subhead">
              <h3>How it works</h3>
              <p>Rent a car in three simple steps.</p>
            </div>

            <div className="process-grid process-grid--home">
              {steps.map((item) => (
                <article key={item.step} className="process-card process-card--home">
                  <span className="process-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="home-packages-row">
              {PACKAGE_ORDER.map((pkg) => (
                <Link
                  key={pkg}
                  to={`/vehicles?package=${pkg}`}
                  className={`home-package-link home-package-link--${pkg}`}
                >
                  <span className={`package-badge package-badge--${pkg}`}>
                    {PACKAGE_INFO[pkg].label}
                  </span>
                  <p>{PACKAGE_INFO[pkg].summary}</p>
                </Link>
              ))}
            </div>

            <div className="trust-bar-inline trust-bar-inline--home" aria-label="Rental highlights">
              {trustItems.map((item) => (
                <div key={item.label} className="trust-item">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <p className="home-about-more">
              <Link className="text-link text-link--arrow" to="/about">
                Learn more about our company
              </Link>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-tight rental-process rental-process--home" id="how-it-works">
      <div className="container">
        <div className="section-intro center section-intro--tight">
          <p className="label">How it works</p>
          <h2>Rent a car in three steps</h2>
        </div>

        <div className="process-grid">
          {steps.map((item) => (
            <article key={item.step} className="process-card">
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
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
