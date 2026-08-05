# Kivoo official website

App Store / Google Play marketing site for Kivoo — Mulish, glass mesh, brand blue `#3D38ED` / teal `#2DD4BF`. Layout inspired by the Mobland mobile landing template (device assets under `public/devices/`).

## Develop

```bash
cp .env.example .env.local
# set RESEND_API_KEY (and optionally RESEND_FROM / CONTACT_TO)
npm install
npm run dev
```

`npm run dev` starts Vite and the Resend contact helper (`server/contact.mjs` on port 8787). The form posts to `/api/contact` (proxied in dev).

## Contact (Resend)

Resend cannot be called from the browser (CORS + secret key). This repo includes a tiny Node helper that holds `RESEND_API_KEY` and sends mail.

| Variable | Where | Purpose |
|----------|--------|---------|
| `RESEND_API_KEY` | server | Resend secret |
| `RESEND_FROM` | server | Verified sender |
| `CONTACT_TO` | server | Inbox for form submissions |
| `VITE_CONTACT_API_URL` | frontend | Default `/api/contact` |
| `VITE_CONTACT_EMAIL` | frontend | Display + mailto fallback |

Verify your domain at [resend.com/domains](https://resend.com/domains), then set `RESEND_FROM` to an address on that domain.

Production: run `npm run start:api` and reverse-proxy `/api/contact` to `127.0.0.1:8787`.

## Store URLs

Set in `.env.production` (or `.env.local` for dev):

```
VITE_APP_STORE_URL=https://apps.apple.com/app/...
VITE_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=xyz.kivoo.app
```

## Build & deploy

```bash
npm run build
# from repo: npm run deploy:web  (also refreshes /app Expo build)
# or site only:
rsync -a --delete --filter 'P app/' --filter 'P app/***' dist/ /var/www/kivoo-site/
```
