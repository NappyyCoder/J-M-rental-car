import type { VehicleCategory } from '../types'

/** Bundled images — always available, no external CDN dependency */
/** Home hero uses CSS gradient only — stock hero.jpg is luxury dealership imagery. */
export const HERO_IMAGE_URL = '/images/hero.jpg'

/** Real J&M fleet photos for marketing (not stock luxury cars). */
export const HOME_GOLD_PACKAGE_IMAGE = '/images/fleet/audi-a8.jpeg'
export const HOME_SILVER_PACKAGE_IMAGE = '/images/fleet/chevy-cruze.jpeg'

export const ABOUT_IMAGE_URL = '/images/fleet/vw-cc.jpeg'

export const VEHICLE_FALLBACK_IMAGES: Record<VehicleCategory, string> = {
  economy: '/images/economy.jpg',
  sedan: '/images/sedan.jpg',
  suv: '/images/suv.jpg',
  truck: '/images/truck.jpg',
  van: '/images/van.jpg',
}

export const DEFAULT_VEHICLE_FALLBACK = VEHICLE_FALLBACK_IMAGES.sedan

export function vehicleFallback(category?: VehicleCategory) {
  if (category && category in VEHICLE_FALLBACK_IMAGES) {
    return VEHICLE_FALLBACK_IMAGES[category]
  }
  return DEFAULT_VEHICLE_FALLBACK
}

/** Demo fleet photos matched to vehicle type */
export const DEMO_VEHICLE_IMAGES = {
  goldSedan: '/images/luxury-sedan.jpg',
  goldBmw: '/images/sedan.jpg',
  goldMercedes: '/images/luxury-suv.jpg',
  goldLexus: '/images/suv.jpg',
  silverCivic: '/images/economy.jpg',
  silverCorolla: '/images/compact.jpg',
  silverAltima: '/images/sedan.jpg',
  silverTucson: '/images/suv.jpg',
  silverTruck: '/images/truck.jpg',
  silverVan: '/images/road-trip.jpg',
} as const
