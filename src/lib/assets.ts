import type { VehicleCategory } from '../types'

/** Bundled images — always available, no external CDN dependency */
export const HERO_IMAGE_URL = '/images/hero.jpg'
export const ABOUT_IMAGE_URL = '/images/about.jpg'

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
