import { HOURS, PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'

type Props = {
  title: string
  text: string
}

const HOURS_ROWS = [
  { label: 'Mon–Fri', time: HOURS.weekdays.time },
  { label: 'Saturday', time: HOURS.saturday.time },
] as const

export function PageFoot({ title, text }: Props) {
  return (
    <div className="page-foot">
      <div className="page-foot-copy">
        <p className="label page-foot-label">Get started</p>
        <h2 className="page-foot-title">{title}</h2>
        <p className="page-foot-text">{text}</p>
      </div>
      <div className="page-foot-aside">
        <a className="btn btn-primary btn-lg page-foot-call" href={`tel:${PHONE_TEL}`}>
          Call {PHONE_DISPLAY}
        </a>
        <ul className="page-foot-hours" aria-label="Business hours">
          {HOURS_ROWS.map((row) => (
            <li key={row.label}>
              <span className="page-foot-hours-day">{row.label}</span>
              <span className="page-foot-hours-time">{row.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
