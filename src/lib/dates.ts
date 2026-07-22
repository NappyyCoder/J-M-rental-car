import type { Vehicle } from '../types'

export function isAvailableOn(vehicle: Vehicle, date: string): boolean {
  return !vehicle.unavailableDates.includes(date)
}

export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
