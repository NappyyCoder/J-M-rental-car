import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { SignaturePad } from '../components/SignaturePad'
import { SITE_NAME_SHORT } from '../lib/contact'
import { saveSignedDocument } from '../lib/signCloud'
import {
  allSignFields,
  getSignForm,
  saveSignSubmission,
  type SignField,
  type SignSubmission,
} from '../lib/signForms'
import { isSupabaseConfigured } from '../lib/supabase'
import { buildSignedPdf, downloadPdf, pdfBytesToDataUrl } from '../lib/signPdf'

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: SignField
  value: string
  onChange: (value: string) => void
}) {
  if (field.type === 'choice') {
    return (
      <div className="sign-choice">
        {(field.options ?? []).map((option) => (
          <label key={option.value} className="sign-choice-option">
            <input
              type="radio"
              name={field.name}
              value={option.value}
              checked={value === option.value}
              required={field.required}
              onChange={(e) => onChange(e.target.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <select
        name={field.name}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.type}
      name={field.name}
      required={field.required}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function SignFormPage() {
  const { slug = '' } = useParams()
  const form = useMemo(() => getSignForm(slug), [slug])
  const navigate = useNavigate()
  const fields = useMemo(() => (form ? allSignFields(form) : []), [form])

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ''])),
  )
  const [signature, setSignature] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSignatureChange = useCallback((dataUrl: string | null) => {
    setSignature(dataUrl)
  }, [])

  if (slug === 'waiver') return <Navigate to="/sign/rental-agreement" replace />
  if (!form) return <Navigate to="/sign" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setError(null)

    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        setError(`Please fill in ${field.label}.`)
        return
      }
    }
    if (!signature) {
      setError('Please add your signature.')
      return
    }
    if (!agreed) {
      setError('Please confirm you agree to sign electronically.')
      return
    }

    setSubmitting(true)
    try {
      const id = crypto.randomUUID()
      const signedAt = new Date()
      const retainUntil = new Date(signedAt)
      retainUntil.setFullYear(retainUntil.getFullYear() + form.retentionYears)

      const pdfBytes = await buildSignedPdf({
        form,
        fields: values,
        signatureDataUrl: signature,
        signedAt: signedAt.toISOString(),
        retainUntil: retainUntil.toISOString(),
        submissionId: id,
      })
      const pdfDataUrl = pdfBytesToDataUrl(pdfBytes)

      const submission: SignSubmission = {
        id,
        formSlug: form.slug,
        formTitle: form.title,
        formVersion: form.version,
        fields: values,
        signedAt: signedAt.toISOString(),
        retainUntil: retainUntil.toISOString(),
        pdfDataUrl,
      }

      if (isSupabaseConfigured()) {
        await saveSignedDocument(submission)
      }
      saveSignSubmission(submission)
      downloadPdf(pdfDataUrl, `jm-${form.slug}-${id.slice(0, 8)}.pdf`)
      navigate(`/sign/done/${id}`)
    } catch {
      setError('Could not save the signed PDF. Check the connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <PageLayout noIndex>
      <div className="sign-page">
        <div className="container sign-shell">
          <p className="label">
            {SITE_NAME_SHORT} · v{form.version}
          </p>
          <h1>{form.title}</h1>
          <p className="sign-lead">
            Stored for {form.retentionYears} years after signing. Pickup at our
            Virginia Beach office.
          </p>

          <form className="sign-form" onSubmit={handleSubmit}>
            <section className="sign-card">
              <h2>Agreement</h2>
              <div className="sign-body">
                {form.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>

            {form.sections.map((section) => (
              <section key={section.title} className="sign-card">
                <h2>{section.title}</h2>
                {section.description ? <p className="sign-hint">{section.description}</p> : null}
                <div className="sign-fields">
                  {section.fields.map((field) => (
                    <label
                      key={field.name}
                      className={`field${field.wide || field.type === 'choice' ? ' field-wide' : ''}`}
                    >
                      <span>
                        {field.label}
                        {field.required ? ' *' : ''}
                      </span>
                      <FieldControl
                        field={field}
                        value={values[field.name] ?? ''}
                        onChange={(next) =>
                          setValues((prev) => ({
                            ...prev,
                            [field.name]: next,
                          }))
                        }
                      />
                      {field.helpText ? <small className="sign-help">{field.helpText}</small> : null}
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <section className="sign-card">
              <h2>Sign here</h2>
              <p className="sign-hint">Draw your signature with a finger or mouse.</p>
              <SignaturePad onChange={onSignatureChange} />
              <label className="sign-agree">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to sign this rental agreement electronically for J&amp;M
                  Car Rental. I understand a PDF copy will be stored for{' '}
                  {form.retentionYears} years.
                </span>
              </label>
            </section>

            {error ? <p className="sign-error">{error}</p> : null}

            <div className="sign-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Submit & sign'}
              </button>
              <Link to="/sign" className="btn btn-outline">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
