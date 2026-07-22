import { DEMO_SEED_VEHICLES } from './demoFleetSeed'
import type { Vehicle } from '../types'

const now = new Date().toISOString()

/** Sample fleet for preview when the database has no vehicles yet. */
export const DEMO_VEHICLES: Vehicle[] = DEMO_SEED_VEHICLES.map((v, index) => ({
  id: `demo-${index + 1}`,
  name: v.name,
  make: v.make,
  model: v.model,
  year: v.year,
  category: v.category,
  package: v.package,
  dailyRate: v.dailyRate,
  seats: v.seats,
  transmission: v.transmission,
  imageUrl: v.imageUrl,
  unavailableDates: [],
  createdAt: now,
}))

export function isDemoVehicleId(id: string) {
  return id.startsWith('demo-')
}
