import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { isAvailableOn, todayISO } from '../lib/dates'
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
}

export function FleetSection({ showHead = true }: Props) {
  const { vehicles, loading, error, isDemoFleet } = useFleet()
  const [searchParams, setSearchParams] = useSearchParams()
  const vehiclePackage = packageFromSearch(searchParams)
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState<VehicleCategory | 'all'>('all')
  const [availableOnly, setAvailableOnly] = useState(true)

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (vehiclePackage !== 'all' && v.package !== vehiclePackage) return false
      if (category !== 'all' && v.category !== category) return false
      if (availableOnly && !isAvailableOn(v, date)) return false
      return true
    })
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
    <section className={`section collection${showHead ? '' : ' collection--embedded'}`} id="collection">
      <div className="container">
        {showHead && (
          <div className="collection-head">
            <div>
              <p className="label">Our collection</p>
              <h2>Discover our available vehicles</h2>
            </div>
            <a className="text-link" href="tel:+17035631125">
              Call to book →
            </a>
          </div>
        )}

        {isDemoFleet && (
          <div className="demo-fleet-banner">
            <p>
              <strong>Sample fleet preview</strong> — showing example Gold &amp; Silver vehicles.
              Add your real inventory in{' '}
              <Link to="/admin">Admin</Link> to replace these.
            </p>
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
              {pkg === 'all' ? 'All packages' : PACKAGE_INFO[pkg].label}
            </button>
          ))}
        </div>

        {vehiclePackage !== 'all' && (
          <p className="package-filter-note">{PACKAGE_INFO[vehiclePackage].description}</p>
        )}

        <div className="fleet-toolbar">
          <div className="field">
            <label htmlFor="fleet-date">Date</label>
            <input
              id="fleet-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="fleet-category">Vehicle type</label>
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
              <option value="all">Show all</option>
            </select>
          </div>
          <p className="fleet-count">
            {loading ? 'Loading…' : `${availableCount} shown`} · {formatDate(date)}
          </p>
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
                <p>No vehicles match these filters. Try another package, date, or call us.</p>
              </div>
            ) : (
              filtered.map((v, i) => <VehicleCard key={v.id} vehicle={v} date={date} index={i} />)
            )}
          </div>
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
