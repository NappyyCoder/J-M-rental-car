import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { isAvailableOn, todayISO } from '../lib/dates'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'
import { PageFoot } from './PageFoot'
import { PACKAGE_INFO } from '../lib/packages'
import type { VehicleCategory, VehiclePackage } from '../types'
import { VehicleCard } from './VehicleCard'

const categories: Array<VehicleCategory | 'all'> = [
  'all',
  'economy',
  'sedan',
  'suv',
  'truck',
  'van',
]

const packages: Array<VehiclePackage | 'all'> = ['all', 'gold', 'silver']

function packageFromSearch(params: URLSearchParams): VehiclePackage | 'all' {
  const value = params.get('package')
  if (value === 'gold' || value === 'silver') return value
  return 'all'
}

type Props = {
  showHead?: boolean
  variant?: 'default' | 'page'
}

export function FleetSection({ showHead = true, variant = 'default' }: Props) {
  const isPage = variant === 'page'
  const { vehicles, loading, error, isDemoFleet } = useFleet()
  const [searchParams, setSearchParams] = useSearchParams()
  const vehiclePackage = packageFromSearch(searchParams)
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState<VehicleCategory | 'all'>('all')
  const [availableOnly, setAvailableOnly] = useState(!isPage)

  const filtered = useMemo(() => {
    const list = vehicles.filter((v) => {
      if (vehiclePackage !== 'all' && v.package !== vehiclePackage) return false
      if (category !== 'all' && v.category !== category) return false
      if (availableOnly && !isAvailableOn(v, date)) return false
      return true
    })

    if (!availableOnly) {
      return [...list].sort((a, b) => {
        const aAvailable = isAvailableOn(a, date)
        const bAvailable = isAvailableOn(b, date)
        if (aAvailable === bAvailable) return 0
        return aAvailable ? -1 : 1
      })
    }

    return list
  }, [vehicles, vehiclePackage, category, availableOnly, date])

  const availableCount = filtered.filter((v) => isAvailableOn(v, date)).length
  const showGrid = !loading && vehicles.length > 0

  function setPackageFilter(pkg: VehiclePackage | 'all') {
    const next = new URLSearchParams(searchParams)
    if (pkg === 'all') {
      next.delete('package')
    } else {
      next.set('package', pkg)
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <section
      className={`section collection${isPage ? ' collection--page' : showHead ? '' : ' collection--embedded'}`}
      id="collection"
    >
      <div className="container">
        {!isPage && showHead && (
          <div className="collection-head">
            <div>
              <p className="label">Our cars</p>
              <h2>What is available right now</h2>
            </div>
            <a className="text-link" href={`tel:${PHONE_TEL}`}>
              Call to book
            </a>
          </div>
        )}

        {isDemoFleet && (
          <div className={`demo-fleet-banner${isPage ? ' demo-fleet-banner--compact' : ''}`}>
            <p>
              {isPage ? (
                <>
                  Sample inventory shown. Add real vehicles in <Link to="/admin">Admin</Link>.
                </>
              ) : (
                <>
                  <strong>Sample cars for now.</strong> These are placeholders so you can see how the
                  page will look. Add your real cars in <Link to="/admin">Admin</Link> when you are
                  ready.
                </>
              )}
            </p>
          </div>
        )}

        <div className={isPage ? 'fleet-panel' : undefined}>
          {isPage && (
            <div className="fleet-panel-head">
              <h2>Find a vehicle</h2>
              <p>Filter by package, date, and type. Booked cars show when they open again.</p>
            </div>
          )}

          <div className="package-tabs" role="tablist" aria-label="Rental package">
            {packages.map((pkg) => (
              <button
                key={pkg}
                type="button"
                role="tab"
                aria-selected={vehiclePackage === pkg}
                className={`package-tab${vehiclePackage === pkg ? ' active' : ''}${pkg !== 'all' ? ` package-tab--${pkg}` : ''}`}
                onClick={() => setPackageFilter(pkg)}
              >
                {pkg === 'all' ? 'All' : PACKAGE_INFO[pkg].label}
              </button>
            ))}
          </div>

          {vehiclePackage !== 'all' && (
            <p className="package-filter-note">{PACKAGE_INFO[vehiclePackage].summary}</p>
          )}

          <div className={`fleet-toolbar${isPage ? ' fleet-toolbar--page' : ''}`}>
            <div className="field">
              <label htmlFor="fleet-date">Rental date</label>
              <input
                id="fleet-date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="fleet-category">Type</label>
              <select
                id="fleet-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory | 'all')}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All types' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="fleet-avail">Show</label>
              <select
                id="fleet-avail"
                value={availableOnly ? 'available' : 'all'}
                onChange={(e) => setAvailableOnly(e.target.value === 'available')}
              >
                <option value="available">Available only</option>
                <option value="all">All cars</option>
              </select>
            </div>
            <p className="fleet-count">
              {loading
                ? 'Loading…'
                : availableOnly
                  ? `${availableCount} available`
                  : `${filtered.length} shown`}{' '}
              for {formatDate(date)}
            </p>
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading vehicles…</p>
          </div>
        )}

        {!loading && error && !isDemoFleet && (
          <div className="empty-state">
            <p>Could not load vehicles: {error}</p>
          </div>
        )}

        {showGrid && (
          <div className="fleet-grid" key={`${vehiclePackage}-${category}-${availableOnly}`}>
            {filtered.length === 0 ? (
              <div className="empty-state full-width">
                <p>
                  {isPage
                    ? 'No vehicles available for that date. Try another date or package, or call us for help.'
                    : 'No cars match those filters. Try a different date or package, or give us a call.'}
                </p>
                {isPage && (
                  <a className="btn btn-outline btn-sm" href={`tel:${PHONE_TEL}`}>
                    Call {PHONE_DISPLAY}
                  </a>
                )}
              </div>
            ) : (
              filtered.map((v, i) => <VehicleCard key={v.id} vehicle={v} date={date} index={i} />)
            )}
          </div>
        )}

        {isPage && (
          <PageFoot
            title="Ready to reserve?"
            text="Call during business hours. Debit or credit card required at pickup."
          />
        )}
      </div>
    </section>
  )
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
