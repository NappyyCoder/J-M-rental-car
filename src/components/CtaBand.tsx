import { PHONE_DISPLAY, PHONE_TEL, WEEKLY_RATES_NOTE } from '../lib/contact'

type Props = {
  title?: string
  text?: string
}

export function CtaBand({
  title = 'Ready to rent a car?',
  text = 'Pick your date, find a car you like, and call us to lock it in.',
}: Props) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <p className="label">Get started</p>
          <h2>{title}</h2>
          <p>{text}</p>
          <p className="cta-band-note">{WEEKLY_RATES_NOTE}</p>
        </div>
        <a className="btn btn-primary btn-lg" href={`tel:${PHONE_TEL}`}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </section>
  )
}
