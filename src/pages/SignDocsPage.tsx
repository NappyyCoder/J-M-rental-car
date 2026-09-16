import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StaffGate } from '../components/StaffGate'
import { SITE_NAME_SHORT } from '../lib/contact'
import { listSignedDocuments } from '../lib/signCloud'
import { listSignSubmissions, type SignSubmission } from '../lib/signForms'
import { downloadPdf } from '../lib/signPdf'
import { isSupabaseConfigured } from '../lib/supabase'

/** Hidden staff list. Type /sign/docs. Requires the same login as /admin. */
export function SignDocsPage() {
  const [tick, setTick] = useState(0)
  const [cloud, setCloud] = useState<SignSubmission[] | null>(null)
  const [cloudError, setCloudError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCloud([])
      return
    }
    let cancelled = false
    listSignedDocuments()
      .then((rows) => {
        if (!cancelled) {
          setCloud(rows)
          setCloudError('')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setCloudError(err instanceof Error ? err.message : 'Could not load signed documents.')
          setCloud([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const local = listSignSubmissions()
  const submissions = cloud && cloud.length > 0 ? cloud : local
  const usingLocalOnly = !cloud || (cloud.length === 0 && local.length > 0)

  return (
    <StaffGate
      title="Signed documents"
      lead="Use the same staff email and password as fleet admin."
    >
      <div className="sign-page">
        <div className="container sign-shell sign-shell-wide">
          <p className="label">{SITE_NAME_SHORT} staff</p>
          <h1>Signed documents</h1>
          <p className="sign-lead">
            Copies are kept for 3 years. Type <strong>/sign/docs</strong> to
            open this page. It is not in the public menu.
          </p>
          {cloudError ? <p className="sign-error">{cloudError}</p> : null}
          {usingLocalOnly && !cloudError ? (
            <p className="sign-hint">
              Showing documents saved on this browser. Run the signed-documents
              SQL in Supabase if office copies should appear on every computer.
            </p>
          ) : null}
          <div className="sign-actions" style={{ marginBottom: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setTick((n) => n + 1)}>
              Refresh list
            </button>
            <Link to="/sign" className="btn btn-outline">
              Sign hub
            </Link>
            <Link to="/admin" className="btn btn-outline">
              Fleet admin
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="sign-card sign-empty">
              No signatures yet.{' '}
              <Link to="/sign/rental-agreement">Open the rental agreement</Link>
            </div>
          ) : (
            <div className="sign-table-wrap">
              <table className="sign-table">
                <thead>
                  <tr>
                    <th>Signer</th>
                    <th>Form</th>
                    <th>Signed</th>
                    <th>Keep until</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.fields.renterName || s.fields.fullName || '-'}</strong>
                        <div className="muted">{s.fields.email}</div>
                      </td>
                      <td>
                        {s.formTitle}
                        <div className="muted">v{s.formVersion}</div>
                      </td>
                      <td>{new Date(s.signedAt).toLocaleString()}</td>
                      <td>{new Date(s.retainUntil).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="text-link"
                          onClick={() =>
                            downloadPdf(
                              s.pdfDataUrl,
                              `jm-${s.formSlug}-${s.id.slice(0, 8)}.pdf`,
                            )
                          }
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StaffGate>
  )
}
