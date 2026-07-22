type Props = {
  title?: string
  text?: string
}

export function CtaBand({
  title = "Let's get you moving",
  text = 'Pick your date, choose a vehicle, and call us to confirm your rental.',
}: Props) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <p className="label">Get started</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <a className="btn btn-primary btn-lg" href="tel:+17035631125">
          Call 703-563-1125
        </a>
      </div>
    </section>
  )
}
