export function Contact() {
  const maps =
    'https://www.google.com/maps/search/?api=1&query=3692+S+Plaza+Trail+%2310+Virginia+Beach+VA+23452'

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <div>
          <p className="label">Location</p>
          <h2>Visit J&amp;M Car Rental</h2>
          <address>
            3692 S Plaza Trail #10
            <br />
            Virginia Beach, VA 23452
          </address>
          <p className="contact-phone">
            <a href="tel:+17035631125">703-563-1125</a>
          </p>
          <a className="text-link" href={maps} target="_blank" rel="noreferrer">
            Get directions →
          </a>
        </div>
        <div className="hours-card">
          <h3>Hours</h3>
          <dl>
            <div>
              <dt>Mon – Fri</dt>
              <dd>9:30 AM – 5:30 PM</dd>
            </div>
            <div>
              <dt>Saturday</dt>
              <dd>10:00 AM – 2:00 PM</dd>
            </div>
            <div>
              <dt>Sunday</dt>
              <dd className="closed">Closed</dd>
            </div>
          </dl>
          <div className="contact-note">
            <p><strong>Rental requirements</strong></p>
            <ul>
              <li>Ages 25 and up</li>
              <li>Valid driver&apos;s license</li>
              <li>Debit or credit card — no cash</li>
              <li>Deposit $150–$200</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
