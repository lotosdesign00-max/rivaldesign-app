# Admin Setup

## Required

1. Add server environment variables to `.env`
2. Apply `supabase/admin_live_schema.sql`
3. Restart the dev server
4. Open `/admin`

## Environment

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
CRYPTOPAY_API_TOKEN=
```

## Routes

- `/` — client app
- `/admin/` — admin app
- `/api/admin/*` — admin server endpoints
- `/api/legacy-sync/*` — legacy sync endpoints

## Notes

- The live client app is powered by `legacy/AppLegacy.jsx`
- The admin app is fully separated in `admin/`
- Vercel routing is configured in `vercel.json`
