import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

const highlights = [
  {
    to: '/about',
    label: 'About us',
    title: 'Local and dependable',
    text: 'Virginia Beach rentals with clear terms, well kept cars, and friendly service.',
  },
  {
    to: '/services',
    label: 'Services',
    title: 'Flexible rentals',
    text: 'Daily rentals, same day availability, extra drivers, and easy pickup.',
  },
  {
    to: '/faq',
    label: 'FAQ',
    title: 'Know before you go',
    text: 'Deposits, payment options, age requirements, and what to bring at pickup.',
  },
]

export function HomeHighlights() {
  return (
    <section className="section home-highlights">
      <div className="container">
        <Reveal className="section-intro center">
          <p className="label">Explore</p>
          <h2>Everything you need to rent with confidence</h2>
          <p>Browse our cars, read the rental terms, or get in touch. It only takes a few clicks.</p>
        </Reveal>
        <div className="highlight-grid">
          {highlights.map((item, i) => (
            <Reveal key={item.to} delay={i * 90} className="reveal--grid">
              <Link to={item.to} className="highlight-card">
                <p className="label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="highlight-link">Learn more</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
