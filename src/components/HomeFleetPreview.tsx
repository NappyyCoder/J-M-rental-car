import { useMemo, useState } from 'react'
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

  const filtered = useMemo(() => {
    const list = vehicles.filter((v) => {
      if (vehiclePackage !== 'all' && v.package !== vehiclePackage) return false
      if (vehiclePackage !== 'all' && !isAvailableOn(v, date)) return false
      return true
    })

    if (vehiclePackage === 'all') {
      return [...list].sort((a, b) => {
        const aAvailable = isAvailableOn(a, date)
        const bAvailable = isAvailableOn(b, date)
        if (aAvailable === bAvailable) return 0
        return aAvailable ? -1 : 1
      })
    }

    return list
  }, [vehicles, vehiclePackage, date])

  const availableCount = useMemo(
    () => filtered.filter((v) => isAvailableOn(v, date)).length,
    [filtered, date],
  )

  const showAllPackages = vehiclePackage === 'all'

  if (!loading && vehicles.length === 0) return null

  return (
    <section className="section home-fleet" id="available-cars">
      <div className="container">
        <div className="home-fleet-head">
          <div>
            <p className="label">Available cars</p>
            <h2>{formatDate(date)}</h2>
            {showAllPackages && !loading && filtered.length > 0 && (
              <p className="home-fleet-sub">
                Showing all cars. Booked ones show when they open again.
              </p>
            )}
          </div>
        </div>

        {isDemoFleet && (
          <p className="home-fleet-note">Sample cars for preview.</p>
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

        {!loading && (
          <p className="home-fleet-count">
            {showAllPackages
              ? `${availableCount} of ${filtered.length} ${filtered.length === 1 ? 'car' : 'cars'} available`
              : `${filtered.length} ${filtered.length === 1 ? 'car' : 'cars'} open`}
          </p>
        )}

        {loading ? (
          <p className="home-fleet-status">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="home-fleet-empty">
            <p>
              {showAllPackages
                ? 'No cars in the fleet yet.'
                : 'Nothing open for that date. Try another day, choose All, or call us.'}
            </p>
          </div>
        ) : (
          <div className="fleet-grid fleet-grid--home">
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} date={date} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
