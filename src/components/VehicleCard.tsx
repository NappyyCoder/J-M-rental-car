import type { CSSProperties } from 'react'
import type { Vehicle, VehicleCategory } from '../types'
import { PHONE_TEL } from '../lib/contact'
import { formatDisplayDate, isAvailableOn, nextAvailableDate } from '../lib/dates'
import { packageLabel } from '../lib/packages'
import { SafeImage } from './SafeImage'

const categoryLabel: Record<VehicleCategory, string> = {
  economy: 'Economy',
  sedan: 'Sedan',
  suv: 'SUV',
  truck: 'Truck',
  van: 'Van',
}

type Props = {
  vehicle: Vehicle
  date: string
  index?: number
}

export function VehicleCard({ vehicle, date, index = 0 }: Props) {
  const available = isAvailableOn(vehicle, date)
  const availableAgain = available ? null : nextAvailableDate(vehicle, date)

  return (
    <article
      className={`vehicle vehicle--${vehicle.package}${available ? '' : ' vehicle--booked'}`}
      style={{ '--card-delay': `${Math.min(index, 8) * 50}ms` } as CSSProperties}
    >
      <div className="vehicle-media">
        <SafeImage
          src={vehicle.imageUrl}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fallbackCategory={vehicle.category}
        />
        <span className={`package-badge package-badge--${vehicle.package}`}>
          {packageLabel(vehicle.package)}
        </span>
        {!available && <span className="vehicle-tag booked">Booked</span>}
      </div>
      <div className="vehicle-body">
        <p className="vehicle-series">{categoryLabel[vehicle.category]}</p>
        <h3>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        {!available && (
          <p className="vehicle-available-again">
            {availableAgain
              ? `Available again ${formatDisplayDate(availableAgain)}`
              : 'Call us for availability'}
          </p>
        )}
        <div className="vehicle-foot">
          <span className="vehicle-rate">
            ${vehicle.dailyRate}
            <small>/day</small>
          </span>
          {available ? (
            <a className="vehicle-link" href={`tel:${PHONE_TEL}`}>
              Call to book
            </a>
          ) : (
            <span className="vehicle-link muted">Booked</span>
          )}
        </div>
      </div>
    </article>
  )
}
