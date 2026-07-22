import type { VehicleCategory, VehiclePackage } from '../types'
import { DEMO_VEHICLE_IMAGES } from './assets'

export type DemoSeedVehicle = {
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
}

/** Cars used for Supabase seed SQL and the Admin “Load demo cars” action. */
export const DEMO_SEED_VEHICLES: DemoSeedVehicle[] = [
  {
    name: 'Gold Camry',
    make: 'Toyota',
    model: 'Camry XSE',
    year: 2024,
    category: 'sedan',
    package: 'gold',
    dailyRate: 79,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.goldSedan,
  },
  {
    name: '',
    make: 'BMW',
    model: '330i',
    year: 2023,
    category: 'sedan',
    package: 'gold',
    dailyRate: 89,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.goldBmw,
  },
  {
    name: '',
    make: 'Mercedes-Benz',
    model: 'GLC 300',
    year: 2023,
    category: 'suv',
    package: 'gold',
    dailyRate: 99,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.goldMercedes,
  },
  {
    name: '',
    make: 'Lexus',
    model: 'RX 350',
    year: 2024,
    category: 'suv',
    package: 'gold',
    dailyRate: 105,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.goldLexus,
  },
  {
    name: 'Silver Civic',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    category: 'economy',
    package: 'silver',
    dailyRate: 49,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverCivic,
  },
  {
    name: '',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    category: 'economy',
    package: 'silver',
    dailyRate: 45,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverCorolla,
  },
  {
    name: '',
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    category: 'sedan',
    package: 'silver',
    dailyRate: 55,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverAltima,
  },
  {
    name: '',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    category: 'suv',
    package: 'silver',
    dailyRate: 65,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverTucson,
  },
  {
    name: '',
    make: 'Ford',
    model: 'F-150',
    year: 2020,
    category: 'truck',
    package: 'silver',
    dailyRate: 75,
    seats: 5,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverTruck,
  },
  {
    name: '',
    make: 'Chrysler',
    model: 'Pacifica',
    year: 2021,
    category: 'van',
    package: 'silver',
    dailyRate: 72,
    seats: 7,
    transmission: 'automatic',
    imageUrl: DEMO_VEHICLE_IMAGES.silverVan,
  },
]

export const STOCK_VEHICLE_PHOTOS: { label: string; url: string; category: VehicleCategory }[] = [
  { label: 'Economy', url: '/images/economy.jpg', category: 'economy' },
  { label: 'Compact', url: '/images/compact.jpg', category: 'economy' },
  { label: 'Sedan', url: '/images/sedan.jpg', category: 'sedan' },
  { label: 'Luxury sedan', url: '/images/luxury-sedan.jpg', category: 'sedan' },
  { label: 'SUV', url: '/images/suv.jpg', category: 'suv' },
  { label: 'Luxury SUV', url: '/images/luxury-suv.jpg', category: 'suv' },
  { label: 'Truck', url: '/images/truck.jpg', category: 'truck' },
  { label: 'Van', url: '/images/van.jpg', category: 'van' },
]
