import type { VehicleCategory, VehiclePackage } from '../types'

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

const fleet = (file: string) => `/images/fleet/${file}`

/** J&M fleet — photos in public/images/fleet/ (from client zip). */
export const DEMO_SEED_VEHICLES: DemoSeedVehicle[] = [
  {
    name: '',
    make: 'Audi',
    model: 'A8',
    year: 2012,
    category: 'sedan',
    package: 'gold',
    dailyRate: 99,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('audi-a8.jpeg'),
  },
  {
    name: '',
    make: 'Lincoln',
    model: 'MKS',
    year: 2012,
    category: 'sedan',
    package: 'gold',
    dailyRate: 89,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('lincoln-mks.jpeg'),
  },
  {
    name: '',
    make: 'Volvo',
    model: 'S60',
    year: 2014,
    category: 'sedan',
    package: 'gold',
    dailyRate: 85,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('volvo-s60.jpeg'),
  },
  {
    name: '',
    make: 'Buick',
    model: 'LaCrosse',
    year: 2013,
    category: 'sedan',
    package: 'gold',
    dailyRate: 79,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('buick-lacrosse.jpeg'),
  },
  {
    name: '',
    make: 'Volkswagen',
    model: 'CC',
    year: 2013,
    category: 'sedan',
    package: 'gold',
    dailyRate: 75,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('vw-cc.jpeg'),
  },
  {
    name: '',
    make: 'Nissan',
    model: 'Pathfinder',
    year: 2018,
    category: 'suv',
    package: 'silver',
    dailyRate: 69,
    seats: 7,
    transmission: 'automatic',
    imageUrl: fleet('nissan-pathfinder-silver.jpeg'),
  },
  {
    name: '',
    make: 'Nissan',
    model: 'Pathfinder',
    year: 2014,
    category: 'suv',
    package: 'silver',
    dailyRate: 65,
    seats: 7,
    transmission: 'automatic',
    imageUrl: fleet('nissan-pathfinder-gray.jpeg'),
  },
  {
    name: '',
    make: 'GMC',
    model: 'Terrain',
    year: 2013,
    category: 'suv',
    package: 'silver',
    dailyRate: 65,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('gmc-terrain.jpeg'),
  },
  {
    name: '',
    make: 'Chevrolet',
    model: 'Equinox',
    year: 2012,
    category: 'suv',
    package: 'silver',
    dailyRate: 59,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('chevy-equinox.jpeg'),
  },
  {
    name: '',
    make: 'Subaru',
    model: 'Outback',
    year: 2012,
    category: 'suv',
    package: 'silver',
    dailyRate: 59,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('subaru-outback.jpeg'),
  },
  {
    name: '',
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2014,
    category: 'sedan',
    package: 'silver',
    dailyRate: 55,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('chevy-malibu.jpeg'),
  },
  {
    name: '',
    make: 'Chevrolet',
    model: 'Sonic',
    year: 2014,
    category: 'economy',
    package: 'silver',
    dailyRate: 45,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('chevy-sonic.jpeg'),
  },
  {
    name: '',
    make: 'Chevrolet',
    model: 'Cruze',
    year: 2013,
    category: 'economy',
    package: 'silver',
    dailyRate: 45,
    seats: 5,
    transmission: 'automatic',
    imageUrl: fleet('chevy-cruze.jpeg'),
  },
]

export const STOCK_VEHICLE_PHOTOS: { label: string; url: string; category: VehicleCategory }[] =
  DEMO_SEED_VEHICLES.map((v) => ({
    label: `${v.make} ${v.model}`,
    url: v.imageUrl,
    category: v.category,
  }))
