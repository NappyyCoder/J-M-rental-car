const services = [
  {
    title: 'Daily rentals',
    text: 'Rent by the day for errands, work trips, or visitors — flexible pickup during business hours.',
  },
  {
    title: 'Same-day availability',
    text: 'Browse the fleet online and see what is open for your date before you call.',
  },
  {
    title: 'Additional driver',
    text: 'Add an approved second driver for $50.00. Valid license required.',
  },
  {
    title: 'Local pickup',
    text: '3692 S Plaza Trail #10, Virginia Beach. Mon–Fri 9:30–5:30, Sat 10–2.',
  },
]

export function Services({ showIntro = true }: { showIntro?: boolean }) {
  return (
    <section className="section services" id="services">
      <div className="container">
        {showIntro && (
          <div className="section-intro center">
            <p className="label">Our services</p>
            <h2>Flexible, affordable, and reliable</h2>
            <p>Everything you need for a smooth rental — clear pricing, simple requirements, no hassle.</p>
          </div>
        )}
        <div className="services-grid">
          {services.map((s) => (
            <article key={s.title} className="service-card">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
