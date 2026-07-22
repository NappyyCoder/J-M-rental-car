import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <img
          src="https://framerusercontent.com/images/4MBwe7xoVh8RMCL5IVMhqzelpM.png?scale-down-to=2048"
          alt=""
        />
        <div className="hero-overlay" />
      </div>
      <div className="container hero-content">
        <p className="label hero-in">J&amp;M Car Rental LLC · Virginia Beach</p>
        <h1 className="hero-in">
          Professional rentals.
          <br />
          <span>Clear terms. Ready when you are.</span>
        </h1>
        <p className="hero-lead hero-in">
          Browse Gold and Silver packages, check same-day availability, and call to reserve with
          debit or credit.
        </p>
        <div className="hero-actions hero-in">
          <Link className="btn btn-hero" to="/vehicles">
            View availability
          </Link>
          <a className="btn btn-hero-outline" href="tel:+17035631125">
            Call 703-563-1125
          </a>
        </div>
      </div>
      <a className="hero-scroll" href="#how-it-works" aria-label="Scroll to how it works">
        <span className="hero-scroll-line" />
      </a>
    </section>
  )
}
