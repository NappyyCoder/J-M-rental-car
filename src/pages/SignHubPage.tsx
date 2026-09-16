import { Link } from 'react-router-dom'
import { DeskQr } from '../components/DeskQr'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME_SHORT } from '../lib/contact'
import { SIGN_FORMS } from '../lib/signForms'

/** Hidden desk page. Not in the main menu. Type /sign in the address bar. */
export function SignHubPage() {
  const form = SIGN_FORMS[0]

  return (
    <PageLayout noIndex>
      <div className="sign-page">
        <div className="container sign-shell">
          <p className="label">{SITE_NAME_SHORT} · Desk only</p>
          <h1>Sign rental forms</h1>
          <p className="sign-lead">
            This page is not in the menu. At the desk, type{' '}
            <strong>jmlocalrentals.com/sign</strong> or scan the QR so the
            renter can sign on their phone. Signed copies are kept for 3 years.
          </p>

          <div className="sign-hub-grid">
            <div className="sign-card">
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <ul>
                <li>Open by typing the URL</li>
                <li>Phone signature via QR</li>
                <li>PDF stored for 3 years</li>
              </ul>
              <div className="sign-actions">
                <Link className="btn btn-primary" to={`/sign/${form.slug}`}>
                  Open rental agreement
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
