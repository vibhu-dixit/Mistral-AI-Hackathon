# Frontend — Reporting Web App

Next.js (App Router) client for RoadWatch: photo capture/upload, geotagging,
the analysis-progress screen, the map dashboard, hazard detail, and the
generated-report screen. See [`PLAN.md`](PLAN.md) for the full route map,
component structure, and data types, and [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md)
for the shared hazard schema and backend endpoints.

The app talks to the live backend only. There is no mock-data path.

## Setup

```bash
cd web-app
cp .env.example .env.local
npm install
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL` defaults to `http://localhost:8010`.

## Notes

- The confirmation/report screen surfaces the hazard's report status
  prominently — see the generated-report screen at `/report/[id]`.
- Should work well on mobile browsers (this is how most citizens will
  actually use it — standing next to a pothole), so treat mobile-web as the
  primary layout target even though it's not a native app.
- Stack: **Next.js (App Router) + TypeScript + Tailwind**, map via Leaflet
  (no API key required).
