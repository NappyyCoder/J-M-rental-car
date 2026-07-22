import type { VehiclePackage } from '../types'

export const PACKAGE_INFO: Record<
  VehiclePackage,
  { label: string; title: string; description: string; summary: string }
> = {
  gold: {
    label: 'Gold',
    title: 'Gold package',
    description: 'Our nicer cars. Newer models and higher trims when you want something a step up.',
    summary: 'Premium vehicles with newer models and higher trims.',
  },
  silver: {
    label: 'Silver',
    title: 'Silver package',
    description: 'Solid everyday cars at a good price. Reliable and easy on the wallet.',
    summary: 'Everyday rentals at a lower daily rate.',
  },
}

export const PACKAGE_ORDER: VehiclePackage[] = ['gold', 'silver']

export function packageLabel(pkg: VehiclePackage): string {
  return PACKAGE_INFO[pkg].label
}
