import { PHONE_DISPLAY, PHONE_TEL, VETERAN_OWNED_LABEL, WEEKLY_RATES_NOTE } from '../lib/contact'

export function Hero() {
  return (
    <section className="hero hero--home hero--plain">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-overlay" />
      </div>
      <div className="container hero-content">
        <p className="label hero-in">{VETERAN_OWNED_LABEL}</p>
        <h1 className="hero-in">Car rentals in Virginia Beach</h1>
        <p className="hero-lead hero-in">
          Everyday cars for work, errands, and travel. Call us to book. {WEEKLY_RATES_NOTE}
        </p>
        <div className="hero-actions hero-in">
          <a className="btn btn-hero" href="#available-cars">
            Browse cars
          </a>
          <a className="btn btn-hero-outline" href={`tel:${PHONE_TEL}`}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  )
}
