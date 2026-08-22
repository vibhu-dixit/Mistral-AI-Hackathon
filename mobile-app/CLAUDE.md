# Agent context — Mobile/Frontend

You're working in the reporting app: photo capture, GPS/EXIF geotagging,
submission flow, confirmation screen, and tracking ID lookup.

- This talks to the backend **via API only** — don't reach into a database
  or other folders directly. See `../docs/API_CONTRACT.md` for the request/
  response shapes (`POST /api/reports`, `GET /api/reports/:tracking_id`).
- If the backend isn't ready yet, build against a mock matching that
  contract rather than blocking.
- Stay inside this folder unless a change genuinely needs to touch the
  shared API contract — if so, flag it rather than editing silently.
- No stack is chosen yet. If the user hasn't specified one, ask before
  scaffolding a framework (React Native vs. Flutter vs. web PWA materially
  changes the setup) rather than guessing.
