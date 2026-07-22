export type VehicleCategory = 'economy' | 'sedan' | 'suv' | 'truck' | 'van'
export type VehiclePackage = 'gold' | 'silver'

export interface Vehicle {
  id: string
  name: string
  make: string
  model: string
  year: number
  category: VehicleCategory
  package: VehiclePackage
  dailyRate: number
  seats: number
  transmission: 'automatic' | 'manual'
  imageUrl: string
  unavailableDates: string[]
  createdAt: string
}

export interface VehicleInput {
  name: string
  make: string
  model: string
  year: number
  category: VehicleCategory
  package: VehiclePackage
  dailyRate: number
  seats: number
  transmission: 'automatic' | 'manual'
}
