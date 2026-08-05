# Kivoo official website

App Store / Google Play marketing site for Kivoo — Mulish, glass mesh, brand blue `#3D38ED` / teal `#2DD4BF`. Layout inspired by the Mobland mobile landing template (device assets under `public/devices/`).

## Develop

```bash
cp .env.example .env.local
# set RESEND_API_KEY (and optionally RESEND_FROM / CONTACT_TO)
npm install
npm run dev
```

`npm run dev` starts Vite and the local Resend helper (`server/contact.mjs` on port 8787). The form posts to `/api/contact` (proxied in dev).

## Contact (Resend + Vercel)

Production uses the Vercel serverless function at [`api/contact.js`](api/contact.js). Locally, `server/contact.mjs` mirrors the same behavior.

| Variable | Where | Purpose |
|----------|--------|---------|
| `RESEND_API_KEY` | Vercel / `.env.local` | Resend secret (never `VITE_`) |
| `RESEND_FROM` | Vercel / `.env.local` | Verified sender |
| `CONTACT_TO` | Vercel / `.env.local` | Inbox for form submissions |
| `VITE_CONTACT_API_URL` | frontend build | Default `/api/contact` |
| `VITE_CONTACT_EMAIL` | frontend build | Display + mailto fallback |

In the [Vercel project](https://vercel.com) → **Settings → Environment Variables**, add `RESEND_API_KEY`, `RESEND_FROM`, and `CONTACT_TO`, then redeploy.

Verify your domain at [resend.com/domains](https://resend.com/domains), then set `RESEND_FROM` to an address on that domain (until then, `Kivoo <onboarding@resend.dev>` only delivers to your Resend account email).

## Store URLs

Set in `.env.production` (or `.env.local` for dev):

```
VITE_APP_STORE_URL=https://apps.apple.com/app/...
VITE_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=xyz.kivoo.app
```

## Build & deploy

```bash
npm run build
git push   # Vercel auto-deploys from GitHub
```
