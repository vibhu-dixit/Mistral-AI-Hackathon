# Agent context — Frontend (Reporting Web App)

You're working on the reporting web app: photo capture/upload, geotagging
(browser Geolocation API and/or EXIF from the uploaded photo), analysis
progress, map dashboard, hazard detail, and generated-report submission.
This is a **web app**, not a native mobile app — design mobile-web-first.

- Talk to the backend **via API only**. See `../docs/API_CONTRACT.md`.
- There is no mock-data path. The client always calls
  `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8010`).
- Stay inside this folder unless a change genuinely needs to touch the
  shared API contract — if so, flag it rather than editing silently.
