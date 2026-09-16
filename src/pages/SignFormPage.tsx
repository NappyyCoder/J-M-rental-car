import { Link, Navigate, useParams } from 'react-router-dom'
import { SignForm } from '../agreement/SignForm'
import { getForm } from '../agreement/forms'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME_SHORT } from '../lib/contact'

export function SignFormPage() {
  const { slug = '' } = useParams()
  if (slug === 'waiver') return <Navigate to="/sign/rental-agreement" replace />

  const form = getForm(slug)
  if (!form) return <Navigate to="/sign" replace />

  return (
    <PageLayout noIndex>
      <div className="sign-page">
        <div className="container sign-shell sign-shell-wide">
          <p className="label">
            {SITE_NAME_SHORT} · Rental agreement · v{form.version}
          </p>
          <h1>{form.title}</h1>
          <p className="sign-lead">
            This is the digital front-page agreement. Fill each step, then sign
            both pages of the form. Copies are stored for {form.retentionYears}{' '}
            years after signing.
          </p>
          <SignForm form={form} />
          <p className="sign-hint" style={{ marginTop: '1.5rem' }}>
            <Link to="/sign">Back to desk page</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
