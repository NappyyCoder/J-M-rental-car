import { Link } from 'react-router-dom'
import { useState } from 'react'

type Props = {
  showIntro?: boolean
}

const faqs = [
  {
    q: 'What documents are required to rent a car?',
    a: 'You must be 25 or older with a valid driver’s license. A debit or credit card is required for the deposit — we do not accept cash.',
  },
  {
    q: 'How much is the deposit?',
    a: 'Deposits range from $150.00 to $200.00 depending on the vehicle.',
  },
  {
    q: 'What is the difference between Gold and Silver packages?',
    a: 'Gold includes our premium vehicles — newer models and higher-end options. Silver offers reliable, affordable everyday rentals.',
  },
  {
    q: 'Can I add another driver?',
    a: 'Yes. An additional approved driver is $50.00. They must also have a valid license.',
  },
  {
    q: 'What are your hours?',
    a: 'Monday through Friday 9:30 AM – 5:30 PM, Saturday 10:00 AM – 2:00 PM. Closed Sunday.',
  },
  {
    q: 'How do I book a vehicle?',
    a: 'Check availability on our Vehicles page for your date, then call 703-563-1125 during business hours to reserve.',
    link: { to: '/vehicles', label: 'Browse vehicles' },
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
            <h2>Frequently asked questions</h2>
            <p>Rental terms, payment, and what to bring when you pick up your vehicle.</p>
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
