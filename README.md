# J&M Car Rental LLC

Website for **J&M Car Rental LLC** — Virginia Beach car rentals with shared fleet availability via Supabase.

## Run locally

```bash
npm install
cp .env.example .env   # add your Supabase keys
npm run dev
```

## Supabase setup (one time)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste and run `supabase/schema.sql`
3. Go to **Project Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
4. Paste both into `.env` and restart the dev server
5. Create a staff user: **Authentication → Users → Add user** (email + password)
6. Sign in at `/admin` with that account

## Features

- Public site: hours, requirements, FAQ, contact
- Fleet browser filtered by date / category / availability
- **Shared backend**: all visitors see the same cars and availability
- Admin: upload photos to Supabase Storage, mark days booked
- Row-level security: public read, staff-only write

## Deploy

Build and deploy to Vercel or Netlify. Add the same `VITE_SUPABASE_*` env vars in your host dashboard.

```bash
npm run build
npm run preview
```

## Admin

- URL: `/admin`
- Staff log in with Supabase email/password (not a browser PIN)
