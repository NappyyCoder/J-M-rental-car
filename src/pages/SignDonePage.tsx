import { Link, Navigate, useParams } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME_SHORT } from '../lib/contact'
import { getSignSubmission } from '../lib/signForms'
import { downloadPdf } from '../lib/signPdf'

export function SignDonePage() {
  const { id = '' } = useParams()
  const submission = getSignSubmission(id)

  if (!submission) return <Navigate to="/sign" replace />

  const name = submission.fields.renterName || submission.fields.fullName || 'Signer'

  return (
    <PageLayout noIndex>
      <div className="sign-page">
        <div className="container sign-shell">
          <div className="sign-card">
            <p className="label">Signature saved</p>
            <h1>Thank you</h1>
            <p className="sign-lead">
              {name}, your signed copy of <strong>{submission.formTitle}</strong>{' '}
              is stored with {SITE_NAME_SHORT} until{' '}
              <strong>
                {new Date(submission.retainUntil).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
              .
            </p>
            <div className="sign-actions">
              {submission.pdfDataUrl ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    downloadPdf(
                      submission.pdfDataUrl,
                      `jm-${submission.formSlug}-${submission.id.slice(0, 8)}.pdf`,
                    )
                  }
                >
                  Download PDF
                </button>
              ) : null}
              <Link to="/sign" className="btn btn-outline">
                Done
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
