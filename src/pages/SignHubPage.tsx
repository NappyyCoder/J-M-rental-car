import { Link } from 'react-router-dom'
import { DeskQr } from '../components/DeskQr'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME_SHORT, VETERAN_OWNED_LABEL } from '../lib/contact'
import { SIGN_FORMS } from '../lib/signForms'

/** Hidden demo hub, not linked in site navigation. Share /sign with the client. */
export function SignHubPage() {
  const form = SIGN_FORMS[0]

  return (
    <PageLayout>
      <div className="sign-page">
        <div className="container sign-shell">
          <p className="label">{SITE_NAME_SHORT} · Private demo</p>
          <h1>Sign rental forms at the desk</h1>
          <p className="sign-lead">
            {VETERAN_OWNED_LABEL}. This page is not in the main menu. Open it by
            URL. Customers scan the QR, sign on their phone, and a PDF is saved
            for 3 years (demo storage on this device until cloud storage is
            wired).
          </p>

          <div className="sign-hub-grid">
            <div className="sign-card">
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <ul>
                <li>Phone signature via QR</li>
                <li>PDF generated on submit</li>
                <li>Retain-until date (+3 years)</li>
              </ul>
              <div className="sign-actions">
                <Link className="btn btn-primary" to={`/sign/${form.slug}`}>
                  Open demo form
                </Link>
                <Link className="btn btn-outline" to="/sign/docs">
                  Staff: signed docs
                </Link>
              </div>
            </div>
            <DeskQr path={`/sign/${form.slug}`} label="Desk QR: open form on phone" />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
