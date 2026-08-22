# Frontend — Reporting Web App

Next.js App Router client for the image observation pipeline.

Talks to the backend via `POST /api/observations` — see [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

## Setup

```powershell
cd web-app
copy .env.example .env.local
npm install
npm run dev
```

Default API origin is `http://localhost:8010`. Override with `NEXT_PUBLIC_API_URL`.
