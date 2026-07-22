import { useEffect } from 'react'
import { Logo } from '../components/Logo'
import {
  ADDRESS_LINE1,
  ADDRESS_LINE2,
  HOURS,
  PHONE_DISPLAY,
  PHONE_TEL,
  VETERAN_OWNED_LABEL,
  WEEKLY_RATES_NOTE,
} from '../lib/contact'

export function ComingSoonPage() {
  useEffect(() => {
    document.title = 'Coming Soon | J&M Car Rental LLC'
  }, [])

  return (
    <div className="coming-soon">
      <div className="coming-soon-glow" aria-hidden="true" />
      <main className="coming-soon-inner">
        <Logo variant="footer" className="coming-soon-logo" />
        <p className="coming-soon-label">{VETERAN_OWNED_LABEL} · Virginia Beach, VA</p>
        <h1>Our new website is on the way</h1>
        <p className="coming-soon-lead">
          J&amp;M Car Rental is getting a fresh look online. Rentals are still available — call us
          during business hours to book. {WEEKLY_RATES_NOTE}
        </p>
        <a className="btn btn-primary btn-lg coming-soon-call" href={`tel:${PHONE_TEL}`}>
          Call {PHONE_DISPLAY}
        </a>
        <ul className="coming-soon-hours" aria-label="Business hours">
          <li>
            <span>Mon–Fri</span>
            <span>{HOURS.weekdays.time}</span>
          </li>
          <li>
            <span>Saturday</span>
            <span>{HOURS.saturday.time}</span>
          </li>
        </ul>
        <address className="coming-soon-address">
          {ADDRESS_LINE1}
          <br />
          {ADDRESS_LINE2}
        </address>
      </main>
    </div>
  )
}
