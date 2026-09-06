import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME_SHORT } from '../lib/contact'
import { listSignSubmissions } from '../lib/signForms'
import { downloadPdf } from '../lib/signPdf'

/** Hidden staff list, not in main navigation. Open /sign/docs manually. */
export function SignDocsPage() {
  const [tick, setTick] = useState(0)
  const submissions = useMemo(() => {
    void tick
    return listSignSubmissions()
  }, [tick])

  return (
    <PageLayout>
      <div className="sign-page">
        <div className="container sign-shell sign-shell-wide">
          <p className="label">{SITE_NAME_SHORT} staff</p>
          <h1>Signed documents</h1>
          <p className="sign-lead">
            Demo storage is on this browser for now. Cloud storage (3-year
            retention) comes next. Refresh if you just signed on this same
            device.
          </p>
          <div className="sign-actions" style={{ marginBottom: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setTick((n) => n + 1)}>
              Refresh list
            </button>
            <Link to="/sign" className="btn btn-outline">
              Sign hub
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="sign-card sign-empty">
              No signatures on this device yet.{' '}
              <Link to="/sign/waiver">Sign the sample form</Link>
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
                        <strong>{s.fields.fullName || '-'}</strong>
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
    </PageLayout>
  )
}
