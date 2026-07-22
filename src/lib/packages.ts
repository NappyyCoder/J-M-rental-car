import type { VehiclePackage } from '../types'

export const PACKAGE_INFO: Record<
  VehiclePackage,
  { label: string; title: string; description: string }
> = {
  gold: {
    label: 'Gold',
    title: 'Gold package',
    description: 'Premium vehicles — newer models, higher-end trims, and our best fleet options.',
  },
  silver: {
    label: 'Silver',
    title: 'Silver package',
    description: 'Reliable everyday rentals — affordable, practical cars for daily use.',
  },
}

export const PACKAGE_ORDER: VehiclePackage[] = ['gold', 'silver']

export function packageLabel(pkg: VehiclePackage): string {
  return PACKAGE_INFO[pkg].label
}
