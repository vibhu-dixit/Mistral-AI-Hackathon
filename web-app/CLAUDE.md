# Agent context — Frontend (Reporting Web App)

You're working on the reporting web app: photo capture/upload, geotagging
(browser Geolocation API and/or EXIF from the uploaded photo), submission
flow, confirmation screen, and tracking ID lookup. This is a **web app**,
not a native mobile app — no App Store / Play Store build, no React Native —
but design mobile-web-first since most citizens will use it on a phone
browser standing next to the pothole.

- This talks to the backend **via API only** — don't reach into a database
  or other folders directly. See `../docs/API_CONTRACT.md` for the request/
  response shapes (`POST /api/reports`, `GET /api/reports/:tracking_id`).
- If the backend isn't ready yet, build against a mock matching that
  contract rather than blocking.
- Stay inside this folder unless a change genuinely needs to touch the
  shared API contract — if so, flag it rather than editing silently.
- No stack is chosen yet. If the user hasn't specified one, ask before
  scaffolding a framework (React vs. Vue vs. plain JS) rather than guessing.
