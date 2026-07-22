import type { Vehicle, VehicleCategory, VehicleInput, VehiclePackage } from '../types'
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

export async function addVehicle(input: VehicleInput, imageFile: File): Promise<Vehicle> {
  const supabase = getSupabase()
  const imageUrl = await uploadVehicleImage(imageFile)

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
