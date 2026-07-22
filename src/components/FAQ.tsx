import { Link } from 'react-router-dom'
import { useState } from 'react'
import { DEPOSIT_RANGE, PHONE_DISPLAY, WEEKLY_RATES_NOTE } from '../lib/contact'

type Props = {
  showIntro?: boolean
}

const faqs = [
  {
    q: 'What do I need to rent a car?',
    a: 'You must be 25 or older with a valid driver\'s license. We need a debit or credit card for the deposit. We do not take cash.',
  },
  {
    q: 'How much is the deposit?',
    a: `Most deposits are between ${DEPOSIT_RANGE}. The exact amount depends on the vehicle.`,
  },
  {
    q: 'What is the difference between Gold and Silver?',
    a: 'Gold cars are our premium options, usually newer or nicer models. Silver cars are our standard rentals that cost less day to day.',
  },
  {
    q: 'Can someone else drive the car?',
    a: 'Yes. An extra driver costs $50. They need a valid license too.',
  },
  {
    q: 'Do you offer weekly rates or specials?',
    a: WEEKLY_RATES_NOTE,
  },
  {
    q: 'What are your hours?',
    a: 'Monday through Friday, 9:30 AM to 5:30 PM. Saturday, 10:00 AM to 2:00 PM. We are closed on Sunday.',
  },
  {
    q: 'How do I book a car?',
    a: `Check the Vehicles page for your date, then call ${PHONE_DISPLAY} during business hours to reserve.`,
    link: { to: '/vehicles', label: 'Go to Vehicles' },
  },
]

export function FAQ({ showIntro = true }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className={`section faq${showIntro ? '' : ' faq--page'}`} id="faq">
      <div className={`container faq-grid${showIntro ? '' : ' faq-grid--solo'}`}>
        {showIntro && (
          <div className="faq-intro">
            <p className="label">FAQ</p>
            <h2>Common questions</h2>
            <p>Quick answers about renting from J&amp;M Car Rental.</p>
          </div>
        )}
        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <div key={item.q} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  id={buttonId}
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-a-wrap"
                >
                  <div className="faq-a">
                    <p>{item.a}</p>
                    {'link' in item && item.link && (
                      <Link className="text-link text-link--arrow" to={item.link.to}>
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
