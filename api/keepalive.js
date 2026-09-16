export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.status(405).json({ ok: false })
    return
  }

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    response.status(500).json({ ok: false, error: 'missing supabase env' })
    return
  }

  const ping = await fetch(`${url}/rest/v1/vehicles?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  response.status(ping.ok ? 200 : 502).json({ ok: ping.ok })
}
