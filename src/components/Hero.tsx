import {
  ADDRESS_LINE1,
  ADDRESS_LINE2,
  HOURS,
  MAPS_DIRECTIONS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  VETERAN_OWNED_LABEL,
  WEEKLY_RATES_NOTE,
} from '../lib/contact'

export function Hero() {
  return (
    <section className="hero hero--home hero--plain hero--split">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-grid" />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-badge hero-in">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.3 7.2 17.7l.9-5.4L4.2 8.5l5.4-.8L12 2z"
                fill="currentColor"
              />
            </svg>
            {VETERAN_OWNED_LABEL}
          </span>

          <h1 className="hero-title hero-in">
            Car rentals in <span className="hero-title-accent">Virginia Beach</span>
          </h1>

          <p className="hero-lead hero-in">
            Everyday cars for work, errands, and travel — book yours with a quick call.
          </p>

          <div className="hero-actions hero-in">
            <a className="btn btn-hero" href="#available-cars">
              <span>Browse cars</span>
              <svg
                className="hero-btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <p className="hero-note hero-in">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2c.5 0 1 .2 1.4.6l7 7a2 2 0 0 1 0 2.8z" />
              <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            {WEEKLY_RATES_NOTE}
          </p>
        </div>

        <aside className="hero-card hero-in" aria-label="Store details">
          <p className="hero-card-title">Visit the office</p>

          <ul className="hero-card-list">
            <li className="hero-card-item">
              <span className="hero-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="hero-card-text">
                <span className="hero-card-label">Location</span>
                {ADDRESS_LINE1}
                <br />
                {ADDRESS_LINE2}
                <a className="hero-card-link" href={MAPS_DIRECTIONS_URL} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </span>
            </li>

            <li className="hero-card-item">
              <span className="hero-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span className="hero-card-text">
                <span className="hero-card-label">Hours</span>
                {HOURS.weekdays.label}: {HOURS.weekdays.time}
                <br />
                {HOURS.saturday.label}: {HOURS.saturday.time}
                <br />
                {HOURS.sunday.label}: {HOURS.sunday.time}
              </span>
            </li>

            <li className="hero-card-item">
              <span className="hero-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
                </svg>
              </span>
              <span className="hero-card-text">
                <span className="hero-card-label">Call to book</span>
                <a className="hero-card-phone" href={`tel:${PHONE_TEL}`}>
                  {PHONE_DISPLAY}
                </a>
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
