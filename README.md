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

Build and deploy to **Vercel** or **Netlify** (recommended). Add the same `VITE_SUPABASE_*` env vars in your host dashboard before building.

**Coming soon mode:** set `VITE_COMING_SOON=true` in Vercel → Project → Settings → Environment Variables, then redeploy. The public site shows a landing page; `/admin` still works for staff. Set to `false` (or remove) when the full site is ready.

```bash
npm run build
npm run preview
```

The repo includes `vercel.json` for client-side routing (`/vehicles`, `/admin`, etc.).

### Connect a GoDaddy domain (recommended: Vercel + GoDaddy DNS)

Use this when the domain is registered at GoDaddy but the site is hosted on Vercel (free, works well with this stack).

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) → **Add New Project**
   - Import the GitHub repo: `NappyyCoder/J-M-rental-car`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy. Note the URL Vercel gives you (e.g. `j-m-rental-car.vercel.app`).

2. **Add the custom domain in Vercel**
   - Project → **Settings** → **Domains**
   - Add your domain (e.g. `jmrental.com`) and `www.jmrental.com`
   - Vercel shows the DNS records you need.

3. **Update DNS in GoDaddy**
   - GoDaddy → **My Products** → your domain → **DNS** (or **Manage DNS**)
   - For the **root domain** (`example.com`), add what Vercel asks for — usually:
     - Type **A**, Name **@**, Value **76.76.21.21**
   - For **www**, add:
     - Type **CNAME**, Name **www**, Value **cname.vercel-dns.com**
   - Remove old **A** / **CNAME** records that point to GoDaddy parking or old hosting (if any).
   - Save. DNS can take 15 minutes to a few hours.

4. **SSL**
   - Vercel provisions HTTPS automatically once DNS is correct.

5. **Supabase (required for admin login on the live site)**
   - Supabase → **Authentication** → **URL configuration**
   - Set **Site URL** to `https://yourdomain.com`
   - Add **Redirect URLs**: `https://yourdomain.com/**` and `https://www.yourdomain.com/**`

### Alternative: GoDaddy Web Hosting (cPanel)

Use this only if they already pay for GoDaddy **Web Hosting** (not just the domain).

1. Locally: set `.env` with production Supabase keys, then run `npm run build`.
2. In cPanel → **File Manager** → open `public_html`.
3. Delete or back up old site files in `public_html`.
4. Upload **everything inside** the `dist/` folder (including `.htaccess` from the build).
5. Enable **SSL** in cPanel (Let’s Encrypt) for the domain.
6. Update Supabase auth URLs as in step 5 above.

`public/.htaccess` is copied into `dist/` on build so `/vehicles`, `/admin`, etc. work on Apache.

### GoDaddy quick reference

| Goal | Where | What to set |
|------|--------|-------------|
| Point domain to Vercel | GoDaddy DNS | A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com` |
| Env vars for live site | Vercel project settings | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Admin login on live site | Supabase Auth URLs | Site URL + redirect URLs with your domain |

Replace `yourdomain.com` with their actual domain. If you share the domain name and whether they use GoDaddy hosting or only the domain, DNS can be spelled out record-by-record.

## Admin

- URL: `/admin`
- Staff log in with Supabase email/password (not a browser PIN)
