import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { todayISO } from '../lib/dates'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  getSession,
  onAuthChange,
  prepareImageFile,
  signIn,
  signOut,
} from '../lib/vehicles'
import { PageLayout } from '../components/PageLayout'
import { SafeImage } from '../components/SafeImage'
import type { VehicleCategory, VehicleInput, VehiclePackage } from '../types'

const emptyForm: VehicleInput = {
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  category: 'sedan',
  package: 'silver',
  dailyRate: 59,
  seats: 5,
  transmission: 'automatic',
}

export function AdminPage() {
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
    return (
      <PageLayout>
        <div className="admin-page">
          <div className="container admin-shell">
            <div className="admin-gate">
              <p className="label">Setup</p>
              <h1>Backend setup required</h1>
              <p className="admin-gate-lead">
                Create a Supabase project, run the schema file, then add your API keys to{' '}
                <code>.env</code> and restart the dev server.
              </p>
              <ol className="admin-steps">
                <li>Run <code>supabase/schema.sql</code> in Supabase SQL Editor</li>
                <li>If the database already exists, also run <code>supabase/migration-add-package.sql</code></li>
                <li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code></li>
                <li>Restart with <code>npm run dev</code></li>
              </ol>
              <Link to="/" className="btn btn-outline">
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (checking) {
    return (
      <PageLayout>
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
      <PageLayout>
        <div className="admin-page">
          <div className="container admin-shell">
            <div className="admin-gate">
              <p className="label">Staff</p>
              <h1>Sign in</h1>
              <p className="admin-gate-lead">Manage vehicles and daily availability for J&amp;M Car Rental.</p>
              <form
                className="admin-login-form"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError('')
                  try {
                    await signIn(email.trim(), password)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Login failed')
                  }
                }}
              >
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
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
              <p className="form-note">
                Staff accounts are created in Supabase under Authentication, then Users.
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="admin-page">
        <div className="container">
          <AdminDashboard onSignOut={() => void signOut()} />
        </div>
      </div>
    </PageLayout>
  )
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const { dbVehicles, add, remove, toggleUnavailable } = useFleet()
  const [form, setForm] = useState<VehicleInput>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [drag, setDrag] = useState(false)
  const [date, setDate] = useState(todayISO())

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMsg('Please upload an image file.')
      return
    }
    setBusy(true)
    try {
      const prepared = await prepareImageFile(file)
      setImageFile(prepared)
      setPreviewUrl(URL.createObjectURL(prepared))
      setMsg('')
    } catch {
      setMsg('Could not process that image.')
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!imageFile) {
      setMsg('Add a vehicle photo before saving.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      await add(form, imageFile)
      setForm(emptyForm)
      setImageFile(null)
      setPreviewUrl('')
      setMsg('Saved. Everyone will see it on the website now.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save vehicle.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="label">Admin</p>
          <h1>Vehicle inventory</h1>
          <p className="admin-topbar-lead">
            Add cars and mark rental dates. Changes appear on the public site immediately.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <div className="field">
            <label htmlFor="admin-date">Availability date</label>
            <input
              id="admin-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      {msg && (
        <p className={`admin-banner${msg.includes('Saved') ? ' success' : ''}`}>{msg}</p>
      )}

      <div className="admin-layout">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Add a vehicle</h2>
          </div>
          <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
            <div className="field">
              <label htmlFor="name">Nickname (optional)</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Silver Camry"
              />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="make">Make</label>
                <input
                  id="make"
                  required
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="model">Model</label>
                <input
                  id="model"
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  type="number"
                  required
                  min={1995}
                  max={2100}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label htmlFor="category">Vehicle type</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as VehicleCategory })
                  }
                >
                  <option value="economy">Economy</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="package">Package</label>
                <select
                  id="package"
                  value={form.package}
                  onChange={(e) =>
                    setForm({ ...form, package: e.target.value as VehiclePackage })
                  }
                >
                  <option value="gold">Gold (premium)</option>
                  <option value="silver">Silver (standard)</option>
                </select>
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="rate">Daily rate ($)</label>
                <input
                  id="rate"
                  type="number"
                  required
                  min={1}
                  value={form.dailyRate}
                  onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label htmlFor="seats">Seats</label>
                <input
                  id="seats"
                  type="number"
                  required
                  min={2}
                  max={15}
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans">Transmission</label>
              <select
                id="trans"
                value={form.transmission}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transmission: e.target.value as 'automatic' | 'manual',
                  })
                }
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <label
              className={`file-drop${drag ? ' is-dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDrag(false)
                void onFile(e.dataTransfer.files[0])
              }}
            >
              {busy ? 'Processing photo…' : 'Drop photo or click to upload'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
              {previewUrl && <img className="preview-thumb" src={previewUrl} alt="Preview" />}
            </label>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Saving…' : 'Save vehicle'}
            </button>
          </form>
        </section>

        <section className="admin-panel admin-panel-list">
          <div className="admin-panel-head">
            <h2>Fleet</h2>
            <span className="admin-count">{dbVehicles.length} vehicles for {date}</span>
          </div>
          {dbVehicles.length === 0 ? (
            <p className="admin-empty">
              No vehicles yet. Add your first one using the form. Sample cars on the public site
              are placeholders until you save real inventory.
            </p>
          ) : (
            <ul className="admin-fleet">
              {dbVehicles.map((v) => {
                const booked = v.unavailableDates.includes(date)
                const title = v.name || `${v.year} ${v.make} ${v.model}`
                return (
                  <li className="admin-fleet-item" key={v.id}>
                    <SafeImage src={v.imageUrl} alt={title} fallbackCategory={v.category} />
                    <div className="admin-fleet-body">
                      <div className="admin-fleet-title">
                        <h3>{title}</h3>
                        <span className={`package-badge package-badge--${v.package}`}>
                          {v.package === 'gold' ? 'Gold' : 'Silver'}
                        </span>
                        <span className={`status-pill${booked ? ' booked' : ' open'}`}>
                          {booked ? 'Booked' : 'Available'}
                        </span>
                      </div>
                      <p>
                        {v.year} {v.make} {v.model}, ${v.dailyRate}/day
                      </p>
                    </div>
                    <div className="admin-fleet-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        disabled={busy}
                        onClick={() => void toggleUnavailable(v.id, date)}
                      >
                        {booked ? 'Mark available' : 'Mark booked'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        disabled={busy}
                        onClick={() => {
                          if (confirm(`Remove ${title} from the fleet?`)) void remove(v.id)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
