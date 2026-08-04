# Kivoo official website

App Store / Google Play marketing site for Kivoo — Mulish, glass mesh, brand blue `#3D38ED` / teal `#2DD4BF`. Layout inspired by the Mobland mobile landing template (device assets under `public/devices/`).

## Develop

```bash
cd kivoo/website
npm install
npm run dev
```

## Store URLs

Set in `.env.production` (or `.env.local` for dev):

```
VITE_APP_STORE_URL=https://apps.apple.com/app/...
VITE_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=xyz.kivoo.app
```

All primary CTAs and badges open these links — not the web app.

## Build & deploy

```bash
npm run build
# from repo: npm run deploy:web  (also refreshes /app Expo build)
# or site only:
rsync -a --delete --filter 'P app/' --filter 'P app/***' dist/ /var/www/kivoo-site/
```
