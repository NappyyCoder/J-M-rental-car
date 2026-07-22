import { HERO_IMAGE_URL } from '../lib/assets'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'
import { SafeImage } from './SafeImage'

export function Hero() {
  return (
    <section className="hero hero--home">
      <div className="hero-bg" aria-hidden="true">
        <SafeImage src={HERO_IMAGE_URL} alt="" className="hero-bg-image" fallbackSrc={HERO_IMAGE_URL} />
        <div className="hero-overlay" />
      </div>
      <div className="container hero-content">
        <p className="label hero-in">J&amp;M Car Rental LLC</p>
        <h1 className="hero-in">Car rentals in Virginia Beach</h1>
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
