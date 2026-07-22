import { HOURS, PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'

type Props = {
  title: string
  text: string
}

export function PageFoot({ title, text }: Props) {
  return (
    <div className="page-foot">
      <div>
        <p className="page-foot-title">{title}</p>
        <p className="page-foot-text">{text}</p>
      </div>
      <div className="page-foot-actions">
        <a className="btn btn-primary" href={`tel:${PHONE_TEL}`}>
          Call {PHONE_DISPLAY}
        </a>
        <p className="page-foot-hours">
          {HOURS.weekdays.label}, {HOURS.weekdays.time}. {HOURS.saturday.label},{' '}
          {HOURS.saturday.time}.
        </p>
      </div>
    </div>
  )
}
