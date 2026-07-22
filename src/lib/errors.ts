/** User-facing message from Supabase / network / unknown errors */
export function formatError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return 'Something went wrong. Please try again.'
}

export function fleetSetupHint(message: string): string | null {
  const lower = message.toLowerCase()
  if (lower.includes("'package' column") || lower.includes('package column')) {
    return 'Your Supabase database is missing the package column. Open Supabase → SQL Editor, run supabase/migration-add-package.sql, then try again.'
  }
  if (lower.includes('row-level security') || lower.includes('42501')) {
    return 'You must be signed in as staff to add vehicles. Sign out and sign in again, then retry.'
  }
  if (lower.includes('bucket') || lower.includes('storage')) {
    return 'Photo storage is not set up. Use a stock photo instead, or run supabase/schema.sql to create the vehicle-images bucket.'
  }
  if (lower.includes('relation') && lower.includes('vehicles')) {
    return 'The vehicles table is missing. Run supabase/schema.sql in Supabase SQL Editor first.'
  }
  return null
}

export function formatErrorWithHint(err: unknown): string {
  const message = formatError(err)
  const hint = fleetSetupHint(message)
  return hint ?? message
}
