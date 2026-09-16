import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from './PageLayout'
import { isSupabaseConfigured } from '../lib/supabase'
import { getSession, onAuthChange, signIn } from '../lib/vehicles'

type Props = {
  title: string
  lead: string
  children: ReactNode
}

export function StaffGate({ title, lead, children }: Props) {
  const configured = isSupabaseConfigured()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(configured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!configured) return

    getSession()
      .then((session) => setAuthed(!!session))
      .finally(() => setChecking(false))

    return onAuthChange(setAuthed)
  }, [configured])

  if (!configured) {
    return <PageLayout noIndex>{children}</PageLayout>
  }

  if (checking) {
    return (
      <PageLayout noIndex>
        <div className="admin-page">
          <div className="container admin-shell">
            <p className="admin-loading">Checking login…</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!authed) {
    return (
      <PageLayout noIndex>
        <div className="admin-page">
          <div className="container admin-shell">
            <div className="admin-gate">
              <p className="label">Staff</p>
              <h1>{title}</h1>
              <p className="admin-gate-lead">{lead}</p>
              <form
                className="admin-login-form"
                onSubmit={async (event: FormEvent) => {
                  event.preventDefault()
                  setError('')
                  try {
                    await signIn(email.trim(), password)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Login failed')
                  }
                }}
              >
                <div className="field">
                  <label htmlFor="staff-email">Email</label>
                  <input
                    id="staff-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="staff-password">Password</label>
                  <input
                    id="staff-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Sign in
                  </button>
                  <Link to="/" className="btn btn-outline">
                    Back to site
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return <PageLayout noIndex>{children}</PageLayout>
}
