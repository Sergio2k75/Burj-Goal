# Burj-Goal

Personal goal tower in your browser. Each goal is a floor on a Burj-inspired skyscraper — complete a goal and its windows light up. Goals are saved in **localStorage** on your device (no account, no backend).

## Stack

- Next.js (App Router) + TypeScript + React
- Client-only persistence via `localStorage` (`burj-goal:v1`)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Testing

Playwright E2E tests live under [`tests/`](tests/). See [`tests/README.md`](tests/README.md) for setup and commands (`npm run test:e2e`).

## Deploy to Vercel

1. Push this repo to GitHub (or deploy from the Vercel CLI).
2. In [Vercel](https://vercel.com): **Add New Project** → import the repo.
3. Framework preset: **Next.js**. Leave env vars empty.
4. Click **Deploy**. You get a free `*.vercel.app` URL.
5. Optional custom domain: Project → **Settings** → **Domains** → add your domain and follow DNS instructions.

No environment variables are required for the MVP.

### Vercel CLI

```bash
npm i -g vercel
vercel
```

## Notes

- Each browser/device has its own tower. Clearing site data resets goals.
- Tasks never leave your machine; Vercel only hosts the static app shell.
