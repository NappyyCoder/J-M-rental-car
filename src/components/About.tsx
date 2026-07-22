import { Link } from 'react-router-dom'

type Props = {
  showHeading?: boolean
}

export function About({ showHeading = true }: Props) {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <div className="about-media">
          <img
            src="https://framerusercontent.com/images/5V0FBFBBddUu3pxmv9Ig58Oo.png?scale-down-to=1024"
            alt="J&M Car Rental vehicle"
          />
        </div>
        <div className="about-copy">
          {showHeading && (
            <>
              <p className="label">About us</p>
              <h2>Dependable rentals built around your schedule</h2>
            </>
          )}
          <p>
            J&amp;M Car Rental LLC is a local Virginia Beach business offering clean, well-maintained
            vehicles for daily and short-term use. Pick a date, see what&apos;s open, and call us to
            lock in your rental.
          </p>
          <ul className="about-facts">
            <li>Ages 25 and up</li>
            <li>Debit or credit card — no cash</li>
            <li>Deposits from $150–$200</li>
            <li>Gold &amp; Silver rental packages</li>
          </ul>
          <Link className="text-link" to="/contact">
            Visit our location →
          </Link>
        </div>
      </div>
    </section>
  )
}
