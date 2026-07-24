import { Link } from 'react-router-dom'
import { HOME_GOLD_PACKAGE_IMAGE, HOME_SILVER_PACKAGE_IMAGE } from '../lib/assets'
import { DEPOSIT_RANGE, HOURS, PHONE_DISPLAY, VETERAN_OWNED_LABEL, WEEKLY_RATES_NOTE } from '../lib/contact'
import { PACKAGE_INFO, PACKAGE_ORDER } from '../lib/packages'
import { SafeImage } from './SafeImage'

const steps = [
  { step: '1', title: 'Pick your date' },
  { step: '2', title: 'Call to book' },
  { step: '3', title: 'Pick up' },
]

const trustItems = [
  { value: '25+', label: 'Age 25+' },
  { value: DEPOSIT_RANGE, label: 'Deposit' },
  {
    value: 'Mon–Sat',
    label: 'Open',
    details: [`Mon–Fri ${HOURS.weekdays.time}`, `Sat ${HOURS.saturday.time}`],
  },
  { value: 'Local', label: 'Virginia Beach' },
] as const

const packageImages = {
  gold: HOME_GOLD_PACKAGE_IMAGE,
  silver: HOME_SILVER_PACKAGE_IMAGE,
} as const

type Props = {
  variant?: 'default' | 'home'
}

export function RentalProcess({ variant = 'default' }: Props) {
  const isHome = variant === 'home'

  if (isHome) {
    return (
      <section className="section home-main" id="about">
        <div className="container">
          <div className="home-intro-copy">
            <p className="label">About J&amp;M</p>
            <h2>Local rentals in Virginia Beach</h2>
            <p className="home-intro-lead">
              J&amp;M Car Rental LLC is a {VETERAN_OWNED_LABEL.toLowerCase()} neighborhood shop for
              everyday driving and short trips. Browse what is open below, then call us to hold your car.
            </p>

            <ul className="home-intro-highlights">
              <li>
                <strong>Gold &amp; Silver</strong>
                <span>Nicer or everyday local cars</span>
              </li>
              <li>
                <strong>Weekly rates</strong>
                <span>{WEEKLY_RATES_NOTE}</span>
              </li>
              <li>
                <strong>25+ to rent</strong>
                <span>{DEPOSIT_RANGE} deposit at pickup</span>
              </li>
              <li>
                <strong>Mon through Sat</strong>
                <span>
                  {HOURS.weekdays.time}. Sat {HOURS.saturday.time}.
                </span>
              </li>
            </ul>

            <div className="home-intro-actions">
              <Link className="btn btn-primary home-intro-cta" to="/about">
                Read our story
              </Link>
              <a className="btn btn-outline" href="#available-cars">
                Browse cars
              </a>
            </div>
          </div>

          <p className="home-section-label">How it works</p>
          <div className="home-steps-visual" aria-label="How it works">
            {steps.map((item) => (
              <article key={item.step} className="home-step-card home-step-card--plain">
                <span className="home-step-badge home-step-badge--plain">{item.step}</span>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>

          <p className="home-section-label">Choose a package</p>
          <div className="home-packages-visual">
            {PACKAGE_ORDER.map((pkg) => (
              <Link
                key={pkg}
                to={`/vehicles?package=${pkg}`}
                className={`home-package-visual home-package-visual--${pkg}`}
              >
                <SafeImage
                  src={packageImages[pkg]}
                  alt=""
                  className="home-package-photo"
                  fallbackCategory={pkg === 'gold' ? 'sedan' : 'economy'}
                />
                <div className="home-package-overlay">
                  <span className={`package-badge package-badge--${pkg}`}>
                    {PACKAGE_INFO[pkg].label}
                  </span>
                  <p>{pkg === 'gold' ? 'Nicer local cars' : 'Everyday cars'}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="trust-bar-inline trust-bar-inline--home" aria-label="Rental highlights">
            {trustItems.map((item) => (
              <div key={item.label} className="trust-item">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                {'details' in item &&
                  item.details.map((line) => (
                    <span key={line} className="trust-item-detail">
                      {line}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const defaultSteps = [
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

  return (
    <section className="section section-tight rental-process rental-process--home" id="how-it-works">
      <div className="container">
        <div className="section-intro center section-intro--tight">
          <p className="label">How it works</p>
          <h2>Rent a car in three steps</h2>
        </div>

        <div className="process-grid">
          {defaultSteps.map((item) => (
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
              {'details' in item &&
                item.details.map((line) => (
                  <span key={line} className="trust-item-detail">
                    {line}
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
