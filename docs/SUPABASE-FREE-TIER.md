# Supabase free tier checklist — J&M Car Rental

Use this when running the site on **Supabase Free** + **Vercel** + **GoDaddy DNS** with a fleet of up to ~60 cars.

---

## Quick answer

| Question | Answer |
|----------|--------|
| Can free Supabase handle 60 cars? | **Yes.** Database usage stays tiny for this app. |
| Main risks on free? | **Project pause** (7 days idle), **photo storage** if you upload huge files, **bandwidth** only at very high traffic. |
| When to upgrade to Pro ($25/mo)? | When you need no pauses, daily backups, or you outgrow storage/bandwidth. |

---

## 1. Photo strategy (most important cost control)

Your app supports two image sources:

| Approach | Where files live | Counts against Supabase? |
|----------|------------------|---------------------------|
| **Static fleet photos** | `public/images/fleet/` → deployed on Vercel | **No** |
| **Admin uploads** | Supabase Storage bucket `vehicle-images` | **Yes** (1 GB free limit) |

### Recommended for 60 cars

1. **Prefer static paths** for bulk fleet photos:
   - Put JPEGs in `public/images/fleet/`
   - Set each vehicle’s `image_url` to e.g. `/images/fleet/chevy-malibu.jpeg`
   - Push to GitHub → Vercel serves them (fast CDN, no Supabase storage used)

2. **Use admin upload only** when staff need to change a photo without a deploy:
   - Compress before upload: target **200–500 KB** per photo
   - Avoid phone originals (often 3–8 MB each)
   - Free tier allows up to **50 MB per file** — don’t use that headroom for every car

3. **Rough storage math** (Supabase Storage only):
   - 60 × 400 KB ≈ **24 MB** → plenty of room
   - 60 × 3 MB ≈ **180 MB** → still OK
   - 60 × 15 MB ≈ **900 MB** → too close to the 1 GB cap

### Optional: bulk import without Storage

- Run `supabase/seed-demo-vehicles.sql` in SQL Editor, or use **Admin → Load/Replace fleet**
- Seed data already points at `/images/fleet/...` paths on Vercel

---

## 2. Prevent the 7-day project pause

Free Supabase projects **pause after ~7 days with no database activity**. When paused, the public fleet and `/admin` stop working until someone unpauses the project in the Supabase dashboard.

### Pick one keep-alive method

| Method | Effort | Notes |
|--------|--------|-------|
| **UptimeRobot** (free) | Low | HTTP monitor hitting your site every 5 min → triggers fleet API calls |
| **cron-job.org** (free) | Low | Weekly GET to `https://jmlocalrentals.com/vehicles` |
| **Supabase Pro** | Paid | Projects never pause — best for production business sites |

### UptimeRobot setup (example)

1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - Type: **HTTP(s)**
   - URL: `https://www.jmlocalrentals.com/` (or your apex domain)
   - Interval: **5 minutes**
3. Optional second monitor on `/admin` (same host — any page load that loads the app is enough if Supabase is configured)

Traffic from monitors + real visitors counts as normal usage and keeps the DB active.

---

## 3. Database & API — what 60 cars actually use

Your schema is two small tables:

- `vehicles` — one row per car (~1 KB each)
- `vehicle_unavailable_dates` — one row per blocked day per car

**At 60 cars:**

- Vehicles: ~60 KB of data
- Even 50 blocked days × 60 cars = 3,000 rows → still only a few MB
- Free limit: **500 MB database** → you are far below this for years at this scale

The app loads all vehicles + all unavailable dates on each fleet refresh (`fetchVehicles` in `src/lib/vehicles.ts`). At 60 cars that payload is roughly **100–300 KB** — fine for performance and for free-tier egress.

---

## 4. Bandwidth (egress) — when it matters

Free tier includes about **5 GB/month** of database egress (API JSON responses).

Rough estimate:

- ~200 KB per full fleet load
- 5 GB ÷ 200 KB ≈ **25,000 fleet loads/month**

For a local Virginia Beach rental shop, that is usually enough. Image bandwidth is served by **Vercel**, not Supabase, when using `/images/fleet/...` URLs.

**Watch egress if:** you get heavy traffic, bots scraping the site constantly, or you store large JSON blobs (you don’t today).

Check usage: Supabase Dashboard → **Project Settings → Usage**.

---

## 5. Auth & admin (free tier)

- Free tier allows **50,000 monthly active users** — one or two staff accounts is negligible
- Create staff in **Authentication → Users** (email + password)
- For production, set Supabase **Site URL** and **Redirect URLs** to your live domain (see README deploy section)

**Security (already in your schema):**

- Public: read-only on fleet + availability
- Authenticated staff: insert/update/delete vehicles and blocked dates

Do **not** put the Supabase **service role** key in Vercel or the frontend — only `VITE_SUPABASE_ANON_KEY`.

---

## 6. Vercel + env vars checklist

Before go-live, confirm in **Vercel → Project → Settings → Environment Variables**:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (safe in frontend) |
| `VITE_COMING_SOON` | `true` = landing only; `false` = full site |

Redeploy after changing env vars.

---

## 7. GoDaddy DNS checklist

| Record | Name | Value |
|--------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove old GoDaddy Website Builder / parking records that conflict with Vercel.

Verify:

- `https://www.jmlocalrentals.com` loads the Vercel site
- Apex (`https://jmlocalrentals.com`) resolves to Vercel (may take up to 48h after DNS changes)

---

## 8. Monthly maintenance (5 minutes)

- [ ] Open Supabase Dashboard → confirm project is **Active** (not Paused)
- [ ] Check **Usage** → Database size, Storage, Egress (all should be green at 60 cars)
- [ ] Log in to `/admin` once — confirms auth still works
- [ ] Spot-check one vehicle photo loads on `/vehicles`

---

## 9. When to upgrade to Supabase Pro

Upgrade when any of these apply:

| Signal | Why Pro helps |
|--------|----------------|
| Project paused during slow season | Pro never pauses |
| You need reliable backups | Daily backups, 7-day retention |
| Most photos uploaded via admin | 100 GB storage vs 1 GB |
| Traffic grows significantly | 250 GB egress vs 5 GB |
| You want email support | Included on Pro |

**You do not need Pro just because you have 60 cars.** Row count is not the bottleneck.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Fleet empty / “failed to load” | Supabase project paused | Dashboard → **Restore project** |
| Admin login fails on live site | Auth URLs not set for domain | Supabase → Auth → URL configuration |
| Photos broken after edit | Bad `image_url` or Storage policy | Use `/images/fleet/...` or re-upload in admin |
| Site shows old GoDaddy page | DNS not pointing to Vercel | Fix A/CNAME; disconnect Website Builder |
| Coming soon on full site | Env var still true | Set `VITE_COMING_SOON=false` and redeploy |

---

## Summary

**Free tier is a good fit for J&M at ~60 cars** if you:

1. Keep bulk photos on Vercel (`public/images/fleet/`) or compress admin uploads
2. Prevent 7-day pause (monitor or Pro)
3. Set Supabase auth URLs for your GoDaddy/Vercel domain
4. Glance at Supabase usage once a month

Upgrade to Pro when uptime guarantees and backups matter more than saving $25/month.
