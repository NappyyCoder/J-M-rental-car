import { Link } from 'react-router-dom'
import { ABOUT_IMAGE_URL } from '../lib/assets'
import { ADDRESS_LINE1, ADDRESS_LINE2, DEPOSIT_RANGE, HOURS, MAPS_DIRECTIONS_URL, PHONE_DISPLAY, PHONE_TEL, VETERAN_OWNED_LABEL, WEEKLY_RATES_NOTE } from '../lib/contact'
import { LocationMap } from './LocationMap'
import { SafeImage } from './SafeImage'

const values = [
  {
    title: VETERAN_OWNED_LABEL,
    text: 'We are right here in Virginia Beach. When you call, you talk to us, not a big corporate line.',
  },
  {
    title: 'Straightforward terms',
    text: 'We tell you the age requirement, deposit, and payment rules up front so you know what to expect.',
  },
  {
    title: 'See the cars first',
    text: 'Look at Gold and Silver options online and check what is open for your date before you call.',
  },
]

const requirements = [
  { label: 'Minimum age', value: '25 and up' },
  { label: 'License', value: 'Valid driver\'s license' },
  { label: 'Payment', value: 'Debit or credit card only. No cash.' },
  { label: 'Deposit', value: `${DEPOSIT_RANGE}, depending on the vehicle` },
  { label: 'Extra driver', value: '$50' },
  { label: 'Packages', value: 'Gold (premium) and Silver (standard)' },
]

export function About() {
  return (
    <>
      <section className="section about about-story">
        <div className="container about-grid">
          <div className="about-media">
            <SafeImage
              src={ABOUT_IMAGE_URL}
              alt="J&M Car Rental Volkswagen in Virginia Beach"
              fallbackCategory="sedan"
            />
          </div>
          <div className="about-copy">
            <p className="label">Who we are</p>
            <h2>A local rental shop in Virginia Beach</h2>
            <p>
              J&amp;M Car Rental LLC is a {VETERAN_OWNED_LABEL.toLowerCase()} neighborhood shop for
              clean, dependable cars for day to day use and short trips.
              Pick Gold if you want a nicer ride, or Silver if you want something practical and
              affordable.
            </p>
            <p>
              Check the website for open cars, call us to hold one, and pick it up during our
              business hours. {WEEKLY_RATES_NOTE}
            </p>
            <div className="about-actions">
              <Link className="btn btn-primary btn-sm" to="/vehicles">
                See our cars
              </Link>
              <Link className="btn btn-outline btn-sm" to="/contact">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight about-values-section">
        <div className="container">
          <div className="section-intro center section-intro--tight">
            <p className="label">How we work</p>
            <h2>Simple, honest, and local</h2>
          </div>
          <div className="about-values-grid">
            {values.map((item) => (
              <article key={item.title} className="about-value-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight about-details">
        <div className="container about-details-grid">
          <div className="about-info-card">
            <h3>What you need to rent</h3>
            <dl className="about-info-list">
              {requirements.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <Link className="text-link text-link--arrow" to="/faq">
              More questions? Read the FAQ
            </Link>
          </div>

          <div className="about-info-card">
            <h3>Where to find us</h3>
            <address className="about-address">
              {ADDRESS_LINE1}
              <br />
              {ADDRESS_LINE2}
            </address>
            <p className="about-phone">
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </p>
            <dl className="about-hours">
              <div>
                <dt>{HOURS.weekdays.label}</dt>
                <dd>{HOURS.weekdays.time}</dd>
              </div>
              <div>
                <dt>{HOURS.saturday.label}</dt>
                <dd>{HOURS.saturday.time}</dd>
              </div>
              <div>
                <dt>{HOURS.sunday.label}</dt>
                <dd className="closed">{HOURS.sunday.time}</dd>
              </div>
            </dl>
            <div className="location-map-block location-map-block--compact">
              <LocationMap compact />
              <a
                className="text-link text-link--arrow location-map-link"
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Get directions in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
