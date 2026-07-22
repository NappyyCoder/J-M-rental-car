import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Vehicle, VehicleInput } from '../types'
import { DEMO_VEHICLES } from '../lib/demoVehicles'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  addVehicle as addVehicleApi,
  blockDates as blockDatesApi,
  fetchVehicles,
  removeVehicle as removeVehicleApi,
  seedDemoFleet as seedDemoFleetApi,
  toggleDateUnavailable as toggleDateApi,
  unblockDates as unblockDatesApi,
  updateVehicle as updateVehicleApi,
} from '../lib/vehicles'

type FleetContextValue = {
  /** Vehicles shown on the public site (real fleet, or sample preview). */
  vehicles: Vehicle[]
  /** Vehicles stored in Supabase (admin inventory only). */
  dbVehicles: Vehicle[]
  isDemoFleet: boolean
  loading: boolean
  error: string | null
  configured: boolean
  refresh: () => Promise<void>
  add: (input: VehicleInput, image: File | string) => Promise<Vehicle>
  update: (id: string, input: VehicleInput, image?: File | string) => Promise<Vehicle>
  remove: (id: string) => Promise<void>
  toggleUnavailable: (id: string, date: string) => Promise<void>
  blockDates: (id: string, dates: string[]) => Promise<void>
  unblockDates: (id: string, dates: string[]) => Promise<void>
  seedDemo: () => Promise<number>
}

const FleetContext = createContext<FleetContextValue | null>(null)

export function FleetProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [dbVehicles, setDbVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVehicles()
      setDbVehicles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load vehicles')
    } finally {
      setLoading(false)
    }
  }, [configured])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isDemoFleet = !loading && dbVehicles.length === 0
  const vehicles = isDemoFleet ? DEMO_VEHICLES : dbVehicles

  const value = useMemo<FleetContextValue>(
    () => ({
      vehicles,
      dbVehicles,
      isDemoFleet,
      loading,
      error,
      configured,
      refresh,
      add: async (input, image) => {
        const vehicle = await addVehicleApi(input, image)
        await refresh()
        return vehicle
      },
      update: async (id, input, image) => {
        const vehicle = await updateVehicleApi(id, input, image)
        await refresh()
        return vehicle
      },
      remove: async (id) => {
        await removeVehicleApi(id)
        await refresh()
      },
      toggleUnavailable: async (id, date) => {
        await toggleDateApi(id, date)
        await refresh()
      },
      blockDates: async (id, dates) => {
        await blockDatesApi(id, dates)
        await refresh()
      },
      unblockDates: async (id, dates) => {
        await unblockDatesApi(id, dates)
        await refresh()
      },
      seedDemo: async () => {
        const count = await seedDemoFleetApi()
        await refresh()
        return count
      },
    }),
    [vehicles, dbVehicles, isDemoFleet, loading, error, configured, refresh],
  )

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet() {
  const ctx = useContext(FleetContext)
  if (!ctx) throw new Error('useFleet must be used within FleetProvider')
  return ctx
}
