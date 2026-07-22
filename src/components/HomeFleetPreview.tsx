import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFleet } from '../context/FleetContext'
import { isAvailableOn, todayISO } from '../lib/dates'
import { PACKAGE_INFO } from '../lib/packages'
import type { VehiclePackage } from '../types'
import { VehicleCard } from './VehicleCard'

const packages: Array<VehiclePackage | 'all'> = ['all', 'gold', 'silver']

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function HomeFleetPreview() {
  const { vehicles, loading, isDemoFleet } = useFleet()
  const [vehiclePackage, setVehiclePackage] = useState<VehiclePackage | 'all'>('all')
  const [date, setDate] = useState(todayISO())

  const available = useMemo(() => {
    return vehicles.filter((v) => {
      if (vehiclePackage !== 'all' && v.package !== vehiclePackage) return false
      return isAvailableOn(v, date)
    })
  }, [vehicles, vehiclePackage, date])

  if (!loading && vehicles.length === 0) return null

  return (
    <section className="section home-fleet" id="available-cars">
      <div className="container">
        <div className="home-fleet-head">
          <div>
            <p className="label">Today&apos;s fleet</p>
            <h2>Cars available for {formatDate(date)}</h2>
            <p>Choose a car below and call us to reserve it.</p>
          </div>
          <Link className="text-link" to="/vehicles">
            Full fleet page
          </Link>
        </div>

        {isDemoFleet && (
          <p className="home-fleet-note">Sample cars shown until real inventory is added in Admin.</p>
        )}

        <div className="home-fleet-toolbar">
          <div className="package-tabs" role="tablist" aria-label="Rental package">
            {packages.map((pkg) => (
              <button
                key={pkg}
                type="button"
                role="tab"
                aria-selected={vehiclePackage === pkg}
                className={`package-tab${vehiclePackage === pkg ? ' active' : ''}${pkg !== 'all' ? ` package-tab--${pkg}` : ''}`}
                onClick={() => setVehiclePackage(pkg)}
              >
                {pkg === 'all' ? 'All' : PACKAGE_INFO[pkg].label}
              </button>
            ))}
          </div>

          <div className="field home-fleet-date">
            <label htmlFor="home-fleet-date">Date</label>
            <input
              id="home-fleet-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {vehiclePackage !== 'all' && (
          <p className="package-filter-note">{PACKAGE_INFO[vehiclePackage].summary}</p>
        )}

        {!loading && (
          <p className="home-fleet-count">
            {available.length} {available.length === 1 ? 'car' : 'cars'} available
          </p>
        )}

        {loading ? (
          <p className="home-fleet-status">Loading vehicles…</p>
        ) : available.length === 0 ? (
          <div className="home-fleet-empty">
            <p>No cars available for that date. Try another date or package, or call us for help.</p>
            <Link className="btn btn-outline btn-sm" to="/vehicles">
              Browse all cars
            </Link>
          </div>
        ) : (
          <div className="fleet-grid fleet-grid--home">
            {available.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} date={date} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
