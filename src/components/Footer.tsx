import { Link } from 'react-router-dom'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-brand-link">
            <strong>J&amp;M Car Rental LLC</strong>
          </Link>
          <p>Virginia Beach, VA</p>
          <p className="footer-address">
            3692 S Plaza Trail #10
            <br />
            Virginia Beach, VA 23452
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Staff login</Link>
        </nav>
        <div className="footer-contact">
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          <p className="footer-hours">Mon to Fri 9:30 to 5:30. Sat 10 to 2.</p>
          <p>© {new Date().getFullYear()} J&amp;M Car Rental LLC</p>
        </div>
      </div>
    </footer>
  )
}
