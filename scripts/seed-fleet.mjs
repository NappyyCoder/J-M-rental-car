/**
 * Load J&M fleet into Supabase from src/lib/demoFleetSeed.ts data.
 * Usage: npm run seed:fleet
 * Requires .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Uses service role if SUPABASE_SERVICE_ROLE_KEY is set (bypasses RLS for seeding).
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    // optional .env
  }
}

loadEnvFile(join(root, '.env'))

const url = process.env.VITE_SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const fleet = JSON.parse(readFileSync(join(__dirname, 'fleet-seed.json'), 'utf8'))

const supabase = createClient(url, key)

const { error: clearDatesError } = await supabase
  .from('vehicle_unavailable_dates')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000')

if (clearDatesError) {
  console.error('Could not clear unavailable dates:', clearDatesError.message)
  process.exit(1)
}

const { error: clearVehiclesError } = await supabase
  .from('vehicles')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000')

if (clearVehiclesError) {
  console.error('Could not clear vehicles:', clearVehiclesError.message)
  process.exit(1)
}

const rows = fleet.map((v) => ({
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

const { data, error } = await supabase.from('vehicles').insert(rows).select('id, make, model')

if (error) {
  console.error('Insert failed:', error.message)
  if (error.message.includes('policy') || error.message.includes('permission')) {
    console.error(
      '\nTip: seeding needs a staff login via /admin, or add SUPABASE_SERVICE_ROLE_KEY to .env',
    )
  }
  process.exit(1)
}

console.log(`Loaded ${data?.length ?? rows.length} vehicles:`)
for (const row of data ?? []) {
  console.log(`  - ${row.make} ${row.model}`)
}
