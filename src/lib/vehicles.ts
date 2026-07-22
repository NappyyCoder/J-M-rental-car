import type { Vehicle, VehicleCategory, VehicleInput, VehiclePackage } from '../types'
import { DEMO_SEED_VEHICLES } from './demoFleetSeed'
import { getSupabase } from './supabase'

type VehicleRow = {
  id: string
  name: string
  make: string
  model: string
  year: number
  category: VehicleCategory
  package: VehiclePackage
  daily_rate: number
  seats: number
  transmission: 'automatic' | 'manual'
  image_url: string
  created_at: string
}

type UnavailableRow = {
  vehicle_id: string
  unavailable_date: string
}

function mapVehicle(row: VehicleRow, unavailableDates: string[]): Vehicle {
  return {
    id: row.id,
    name: row.name,
    make: row.make,
    model: row.model,
    year: row.year,
    category: row.category,
    package: row.package ?? 'silver',
    dailyRate: Number(row.daily_rate),
    seats: row.seats,
    transmission: row.transmission,
    imageUrl: row.image_url,
    unavailableDates: unavailableDates.sort(),
    createdAt: row.created_at,
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabase()

  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (vehiclesError) throw vehiclesError

  const { data: unavailable, error: unavailableError } = await supabase
    .from('vehicle_unavailable_dates')
    .select('vehicle_id, unavailable_date')

  if (unavailableError) throw unavailableError

  const datesByVehicle = new Map<string, string[]>()
  for (const row of (unavailable ?? []) as UnavailableRow[]) {
    const list = datesByVehicle.get(row.vehicle_id) ?? []
    list.push(row.unavailable_date)
    datesByVehicle.set(row.vehicle_id, list)
  }

  return ((vehicles ?? []) as VehicleRow[]).map((row) =>
    mapVehicle(row, datesByVehicle.get(row.id) ?? []),
  )
}

export async function uploadVehicleImage(file: File): Promise<string> {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('vehicle-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  })

  if (error) throw error

  const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path)
  return data.publicUrl
}

export async function addVehicle(
  input: VehicleInput,
  image: File | string,
): Promise<Vehicle> {
  const supabase = getSupabase()
  const imageUrl = typeof image === 'string' ? image : await uploadVehicleImage(image)

  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      name: input.name || `${input.make} ${input.model}`,
      make: input.make,
      model: input.model,
      year: input.year,
      category: input.category,
      package: input.package,
      daily_rate: input.dailyRate,
      seats: input.seats,
      transmission: input.transmission,
      image_url: imageUrl,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapVehicle(data as VehicleRow, [])
}

export async function removeVehicle(id: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) throw error
}

export async function updateVehicle(
  id: string,
  input: VehicleInput,
  image?: File | string,
): Promise<Vehicle> {
  const supabase = getSupabase()

  const patch: Record<string, string | number> = {
    name: input.name || `${input.make} ${input.model}`,
    make: input.make,
    model: input.model,
    year: input.year,
    category: input.category,
    package: input.package,
    daily_rate: input.dailyRate,
    seats: input.seats,
    transmission: input.transmission,
  }

  if (image instanceof File) {
    patch.image_url = await uploadVehicleImage(image)
  } else if (typeof image === 'string' && image) {
    patch.image_url = image
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error

  const { data: unavailable, error: unavailableError } = await supabase
    .from('vehicle_unavailable_dates')
    .select('unavailable_date')
    .eq('vehicle_id', id)

  if (unavailableError) throw unavailableError

  const dates = (unavailable ?? []).map((row) => row.unavailable_date as string)
  return mapVehicle(data as VehicleRow, dates)
}

export async function toggleDateUnavailable(id: string, date: string): Promise<void> {
  const supabase = getSupabase()

  const { data: existing, error: readError } = await supabase
    .from('vehicle_unavailable_dates')
    .select('id')
    .eq('vehicle_id', id)
    .eq('unavailable_date', date)
    .maybeSingle()

  if (readError) throw readError

  if (existing) {
    const { error } = await supabase.from('vehicle_unavailable_dates').delete().eq('id', existing.id)
    if (error) throw error
    return
  }

  const { error } = await supabase.from('vehicle_unavailable_dates').insert({
    vehicle_id: id,
    unavailable_date: date,
  })

  if (error) throw error
}

export async function seedDemoFleet(): Promise<number> {
  const supabase = getSupabase()

  const { error: clearDatesError } = await supabase
    .from('vehicle_unavailable_dates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (clearDatesError) throw clearDatesError

  const { error: clearVehiclesError } = await supabase
    .from('vehicles')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (clearVehiclesError) throw clearVehiclesError

  const rows = DEMO_SEED_VEHICLES.map((v) => ({
    name: v.name || `${v.make} ${v.model}`,
    make: v.make,
    model: v.model,
    year: v.year,
    category: v.category,
    package: v.package,
    daily_rate: v.dailyRate,
    seats: v.seats,
    transmission: v.transmission,
    image_url: v.imageUrl,
  }))

  const { error } = await supabase.from('vehicles').insert(rows)
  if (error) throw error
  return rows.length
}

export async function blockDates(vehicleId: string, dates: string[]): Promise<void> {
  const supabase = getSupabase()
  const unique = [...new Set(dates)].filter(Boolean)
  if (unique.length === 0) return

  const { data: existing, error: readError } = await supabase
    .from('vehicle_unavailable_dates')
    .select('unavailable_date')
    .eq('vehicle_id', vehicleId)
    .in('unavailable_date', unique)

  if (readError) throw readError

  const have = new Set((existing ?? []).map((row) => row.unavailable_date as string))
  const toAdd = unique.filter((d) => !have.has(d))
  if (toAdd.length === 0) return

  const { error } = await supabase.from('vehicle_unavailable_dates').insert(
    toAdd.map((unavailable_date) => ({ vehicle_id: vehicleId, unavailable_date })),
  )
  if (error) throw error
}

export async function unblockDates(vehicleId: string, dates: string[]): Promise<void> {
  const supabase = getSupabase()
  const unique = [...new Set(dates)].filter(Boolean)
  if (unique.length === 0) return

  const { error } = await supabase
    .from('vehicle_unavailable_dates')
    .delete()
    .eq('vehicle_id', vehicleId)
    .in('unavailable_date', unique)

  if (error) throw error
}

/** Resize image before upload to keep storage lean. */
export function prepareImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas unavailable'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'))
              return
            }
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality,
        )
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthChange(callback: (signedIn: boolean) => void) {
  const supabase = getSupabase()
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session)
  })
  return () => subscription.unsubscribe()
}

export async function getSession() {
  const supabase = getSupabase()
  const { data } = await supabase.auth.getSession()
  return data.session
}

/** Returns setup instructions when the DB schema is incomplete. */
export async function getFleetSchemaIssue(): Promise<string | null> {
  const supabase = getSupabase()
  const { error } = await supabase.from('vehicles').select('package').limit(1)

  if (!error) return null

  const message = error.message?.toLowerCase() ?? ''
  if (message.includes('package')) {
    return 'Run supabase/migration-add-package.sql in Supabase → SQL Editor, then refresh this page.'
  }
  if (message.includes('relation') || message.includes('does not exist')) {
    return 'Run supabase/schema.sql in Supabase → SQL Editor to create the database tables.'
  }
  return null
}
