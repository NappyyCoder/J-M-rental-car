import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { VehicleAvailabilityEditor } from '../components/VehicleAvailabilityEditor'
import { VehicleEditForm } from '../components/VehicleEditForm'
import { formatErrorWithHint } from '../lib/errors'
import { STOCK_VEHICLE_PHOTOS } from '../lib/demoFleetSeed'
import { eachDateISO, formatDisplayDate, isAvailableOn, todayISO } from '../lib/dates'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  getSession,
  getFleetSchemaIssue,
  onAuthChange,
  prepareImageFile,
  signIn,
  signOut,
} from '../lib/vehicles'
import { PageLayout } from '../components/PageLayout'
import { SafeImage } from '../components/SafeImage'
import type { Vehicle, VehicleCategory, VehicleInput, VehiclePackage } from '../types'

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

type FleetFilter = 'all' | 'available' | 'booked'

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
                <li>Create a staff user in Supabase → Authentication → Users</li>
                <li>Sign in at <code>/admin</code> and click <strong>Load fleet cars</strong>, or run <code>supabase/seed-demo-vehicles.sql</code></li>
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
              <p className="admin-gate-lead">
                Add cars, remove cars, and mark which days each vehicle is booked or available.
              </p>
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
  const { dbVehicles, add, update, remove, blockDates, unblockDates, seedDemo } = useFleet()
  const [form, setForm] = useState<VehicleInput>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [stockImage, setStockImage] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [drag, setDrag] = useState(false)
  const [date, setDate] = useState(todayISO())
  const [fleetFilter, setFleetFilter] = useState<FleetFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [schemaIssue, setSchemaIssue] = useState<string | null>(null)

  useEffect(() => {
    void getFleetSchemaIssue().then(setSchemaIssue)
  }, [dbVehicles.length])

  const stats = useMemo(() => {
    const available = dbVehicles.filter((v) => isAvailableOn(v, date)).length
    return {
      total: dbVehicles.length,
      available,
      booked: dbVehicles.length - available,
    }
  }, [dbVehicles, date])

  const filteredFleet = useMemo(() => {
    return dbVehicles.filter((v) => {
      const booked = !isAvailableOn(v, date)
      if (fleetFilter === 'available') return !booked
      if (fleetFilter === 'booked') return booked
      return true
    })
  }, [dbVehicles, date, fleetFilter])

  const availableFleet = useMemo(
    () => dbVehicles.filter((v) => isAvailableOn(v, date)),
    [dbVehicles, date],
  )

  const bookedFleet = useMemo(
    () => dbVehicles.filter((v) => !isAvailableOn(v, date)),
    [dbVehicles, date],
  )

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
      setStockImage('')
      setPreviewUrl(URL.createObjectURL(prepared))
      setMsg('')
    } catch {
      setMsg('Could not process that image.')
    } finally {
      setBusy(false)
    }
  }

  function onStockPhoto(url: string, category: VehicleCategory) {
    setStockImage(url)
    setImageFile(null)
    setPreviewUrl(url)
    setForm((prev) => ({ ...prev, category }))
    setMsg('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const image = imageFile ?? stockImage
    if (!image) {
      setMsg('Choose a stock photo or upload your own before saving.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      await add(form, image)
      setForm(emptyForm)
      setImageFile(null)
      setStockImage('')
      setPreviewUrl('')
      setMsg('Vehicle saved. It is live on the website now.')
    } catch (err) {
      setMsg(formatErrorWithHint(err))
    } finally {
      setBusy(false)
    }
  }

  async function onSeedDemo() {
    if (
      !confirm(
        dbVehicles.length > 0
          ? 'Replace the entire fleet with the 13 J&M cars and photos? Unavailable dates will be cleared.'
          : 'Load the 13 J&M fleet cars with photos from the site?',
      )
    ) {
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const count = await seedDemo()
      setMsg(`Loaded ${count} fleet cars. Check the homepage and Vehicles page.`)
    } catch (err) {
      setMsg(formatErrorWithHint(err))
    } finally {
      setBusy(false)
    }
  }

  async function onAddUnavailable(vehicleId: string, title: string, dates: string[]) {
    setBusy(true)
    setMsg('')
    try {
      await blockDates(vehicleId, dates)
      setMsg(`Marked ${dates.length} day(s) unavailable for ${title}.`)
    } catch (err) {
      setMsg(formatErrorWithHint(err))
    } finally {
      setBusy(false)
    }
  }

  async function onRemoveUnavailable(vehicleId: string, title: string, dates: string[]) {
    setBusy(true)
    setMsg('')
    try {
      await unblockDates(vehicleId, dates)
      setMsg(`Marked ${dates.length} day(s) available for ${title}.`)
    } catch (err) {
      setMsg(formatErrorWithHint(err))
    } finally {
      setBusy(false)
    }
  }

  function renderFleetRow(v: Vehicle) {
    const bookedOnDate = !isAvailableOn(v, date)
    const title = v.name || `${v.year} ${v.make} ${v.model}`
    const expanded = expandedId === v.id

    return (
      <li
        key={v.id}
        className={`admin-fleet-row${expanded ? ' is-expanded' : ''}${bookedOnDate ? ' is-unavailable' : ' is-available'}`}
      >
        <button
          type="button"
          className="admin-fleet-row-btn"
          aria-expanded={expanded}
          onClick={() => setExpandedId(expanded ? null : v.id)}
        >
          <SafeImage src={v.imageUrl} alt="" fallbackCategory={v.category} />
          <div className="admin-fleet-row-info">
            <div className="admin-fleet-title">
              <h3>{title}</h3>
              <span className={`package-badge package-badge--${v.package}`}>
                {v.package === 'gold' ? 'Gold' : 'Silver'}
              </span>
            </div>
            <p>
              {v.year} {v.make} {v.model} · ${v.dailyRate}/day
            </p>
          </div>
          <span className={`status-pill${bookedOnDate ? ' booked' : ' open'}`}>
            {bookedOnDate ? 'Unavailable' : 'Available'}
          </span>
          <span className="admin-fleet-chevron" aria-hidden="true">
            {expanded ? '▾' : '›'}
          </span>
        </button>

        {expanded && (
          <div className="admin-fleet-expanded">
            <VehicleEditForm
              key={v.id}
              vehicle={v}
              disabled={busy}
              onSave={async (input, image) => {
                const updated = await update(v.id, input, image)
                setMsg(`Updated ${input.name || `${input.make} ${input.model}`}.`)
                return updated.imageUrl
              }}
            />
            <div className="admin-fleet-expanded-divider" aria-hidden="true" />
            <VehicleAvailabilityEditor
              vehicleId={v.id}
              vehicleTitle={title}
              unavailableDates={v.unavailableDates}
              disabled={busy}
              onAddDate={(targetDate) => onAddUnavailable(v.id, title, [targetDate])}
              onAddRange={(start, end) =>
                onAddUnavailable(v.id, title, eachDateISO(start, end))
              }
              onRemoveDate={(targetDate) => onRemoveUnavailable(v.id, title, [targetDate])}
              onClearAll={() => onRemoveUnavailable(v.id, title, v.unavailableDates)}
              onDelete={() => {
                if (!confirm(`Remove ${title} from the fleet? This cannot be undone.`)) return
                setBusy(true)
                void remove(v.id)
                  .then(() => {
                    setExpandedId(null)
                    setMsg(`${title} removed from the fleet.`)
                  })
                  .catch((err) => setMsg(formatErrorWithHint(err)))
                  .finally(() => setBusy(false))
              }}
            />
          </div>
        )}
      </li>
    )
  }

  function renderFleetList(vehicles: Vehicle[], groupLabel?: string) {
    if (vehicles.length === 0) return null
    return (
      <div className="admin-fleet-group">
        {groupLabel && <h3 className="admin-fleet-group-title">{groupLabel}</h3>}
        <ul className="admin-fleet-list">{vehicles.map(renderFleetRow)}</ul>
      </div>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="label">Admin</p>
          <h1>Manage fleet and availability</h1>
          <p className="admin-topbar-lead">
            Add or remove cars, then mark which days each one is booked. The public site updates
            right away.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <div className="field">
            <label htmlFor="admin-date">Filter by date</label>
            <input
              id="admin-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      {schemaIssue && (
        <p className="admin-banner admin-banner--warn">{schemaIssue}</p>
      )}

      {msg && (
        <p className={`admin-banner${msg.includes('saved') || msg.includes('Loaded') || msg.includes('Updated') || msg.includes('Changes saved') ? ' success' : ''}`}>
          {msg}
        </p>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <strong>{stats.total}</strong>
          <span>Total cars</span>
        </div>
        <div className="admin-stat admin-stat--open">
          <strong>{stats.available}</strong>
          <span>Available {formatDisplayDate(date)}</span>
        </div>
        <div className="admin-stat admin-stat--booked">
          <strong>{stats.booked}</strong>
          <span>Booked {formatDisplayDate(date)}</span>
        </div>
      </div>

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
            </div>
            <div className="row-2">
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
            </div>
            <div className="row-2">
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
            </div>

            <div className="field">
              <span className="field-label">Photo</span>
              <div className="stock-photo-grid">
                {STOCK_VEHICLE_PHOTOS.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    className={`stock-photo-btn${stockImage === photo.url ? ' active' : ''}`}
                    onClick={() => onStockPhoto(photo.url, photo.category)}
                  >
                    <SafeImage src={photo.url} alt={photo.label} fallbackCategory={photo.category} />
                    <span>{photo.label}</span>
                  </button>
                ))}
              </div>
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
              {busy ? 'Processing photo…' : 'Or upload your own photo'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
              {previewUrl && <img className="preview-thumb" src={previewUrl} alt="Preview" />}
            </label>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Saving…' : 'Add to fleet'}
            </button>
          </form>
        </section>

        <section className="admin-panel admin-panel-list">
          <div className="admin-panel-head">
            <div>
              <h2>Fleet list</h2>
              <p className="admin-panel-sub">
                Click a car to edit details, pricing, or unavailable dates.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={busy}
              onClick={() => void onSeedDemo()}
            >
              {dbVehicles.length === 0 ? 'Load fleet cars' : 'Replace fleet'}
            </button>
          </div>

          <div className="admin-fleet-filters" role="tablist" aria-label="Fleet filter">
            {(['all', 'available', 'booked'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={fleetFilter === filter}
                className={`admin-filter-tab${fleetFilter === filter ? ' active' : ''}`}
                onClick={() => setFleetFilter(filter)}
              >
                {filter === 'all' ? 'All' : filter === 'available' ? 'Available' : 'Booked'}
              </button>
            ))}
          </div>

          {dbVehicles.length === 0 ? (
            <div className="admin-empty">
              <p>No vehicles in Supabase yet. The public site shows sample placeholders.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={busy}
                onClick={() => void onSeedDemo()}
              >
                Load 13 fleet cars
              </button>
              <p className="admin-empty-note">
                Or add cars one at a time with the form on the left.
              </p>
            </div>
          ) : filteredFleet.length === 0 ? (
            <p className="admin-empty">No cars match this filter for {formatDisplayDate(date)}.</p>
          ) : fleetFilter === 'all' ? (
            <div className="admin-fleet-groups">
              {renderFleetList(
                availableFleet,
                `Available on ${formatDisplayDate(date)} (${availableFleet.length})`,
              )}
              {renderFleetList(
                bookedFleet,
                `Unavailable on ${formatDisplayDate(date)} (${bookedFleet.length})`,
              )}
            </div>
          ) : (
            renderFleetList(filteredFleet)
          )}
        </section>
      </div>
    </>
  )
}
