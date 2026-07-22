import { Link } from 'react-router-dom'
import { PACKAGE_INFO, PACKAGE_ORDER } from '../lib/packages'

type Props = {
  compact?: boolean
}

export function Packages({ compact = false }: Props) {
  return (
    <section
      className={`section section-tight packages${compact ? ' packages--compact' : ''}`}
      id="packages"
    >
      <div className="container">
        <div className={`section-intro center${compact ? ' section-intro--tight' : ''}`}>
          <p className="label">Rental packages</p>
          <h2>{compact ? 'Gold and Silver' : 'Gold and Silver cars'}</h2>
          {!compact && (
            <p>
              Gold is our premium line. Silver is our everyday line. Both are listed on the
              Vehicles page so you can compare before you call.
            </p>
          )}
        </div>
        <div className="package-cards">
          {PACKAGE_ORDER.map((pkg) => (
            <article key={pkg} className={`package-card package-card--${pkg}`}>
              <span className={`package-badge package-badge--${pkg}`}>{PACKAGE_INFO[pkg].label}</span>
              <h3>{PACKAGE_INFO[pkg].title}</h3>
              <p>{PACKAGE_INFO[pkg].description}</p>
              <Link className="text-link text-link--arrow" to={`/vehicles?package=${pkg}`}>
                View {PACKAGE_INFO[pkg].label} cars
              </Link>
            </article>
          ))}
        </div>
        {compact && (
          <p className="packages-cta">
            <Link className="btn btn-primary btn-sm" to="/vehicles">
              View all cars
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
