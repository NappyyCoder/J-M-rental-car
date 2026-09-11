import { SHOP_IMAGE_URL } from '../lib/assets'
import {
  ADDRESS_LINE1,
  ADDRESS_LINE2,
  DEPOSIT_RANGE,
  HOURS,
  MAPS_DIRECTIONS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../lib/contact'
import { LocationMap } from './LocationMap'
import { SafeImage } from './SafeImage'

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact-layout">
        <div className="contact-place">
          <p className="label">Location</p>
          <h2>Come see us</h2>
          <address className="place-address">
            <strong>{ADDRESS_LINE1}</strong>
            {ADDRESS_LINE2}
          </address>
          <p className="contact-phone">
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </p>
          <a
            className="text-link text-link--arrow"
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Get directions in Google Maps
          </a>
        </div>

        <div className="hours-card">
          <h3>Hours</h3>
          <dl>
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
          <div className="contact-note">
            <p><strong>Before you pick up</strong></p>
            <ul>
              <li>Must be 25 or older</li>
              <li>Valid driver&apos;s license</li>
              <li>Debit or credit card only. No cash.</li>
              <li>Deposit usually {DEPOSIT_RANGE}</li>
            </ul>
          </div>
        </div>

        <div className="contact-media">
          <div className="location-map-block">
            <LocationMap />
          </div>
          <figure className="shop-photo shop-photo--side">
            <SafeImage
              src={SHOP_IMAGE_URL}
              alt="J and M Car Rental shop in Virginia Beach"
            />
            <figcaption>Pickup at our Virginia Beach shop</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
