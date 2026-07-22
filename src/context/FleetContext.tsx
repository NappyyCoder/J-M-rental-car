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
  fetchVehicles,
  removeVehicle as removeVehicleApi,
  toggleDateUnavailable as toggleDateApi,
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
  add: (input: VehicleInput, imageFile: File) => Promise<Vehicle>
  remove: (id: string) => Promise<void>
  toggleUnavailable: (id: string, date: string) => Promise<void>
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
      add: async (input, imageFile) => {
        const vehicle = await addVehicleApi(input, imageFile)
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
