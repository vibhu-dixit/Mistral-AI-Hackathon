# Frontend — Reporting Web App

## Scope

- Photo capture/upload UI (browser camera via `<input capture>` /
  `getUserMedia`, or a plain file upload)
- Geotagging: browser Geolocation API for current position, and/or reading
  GPS EXIF data out of an uploaded photo if present
- Report submission flow → confirmation screen → tracking ID lookup
- Talks to the backend via API only (see [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md))

## Notes

- You don't need a live backend to start. Mock `POST /api/reports` and
  `GET /api/reports/:tracking_id` against the shapes in the API contract
  (e.g. a local JSON file or `json-server`), and swap in the real base URL
  once Backend has something running.
- The confirmation screen should surface the `tracking_id` prominently —
  it's how the citizen looks up status later.
- Should work well on mobile browsers (this is how most citizens will
  actually use it — standing next to a pothole), so treat mobile-web as the
  primary layout target even though it's not a native app.
- Pick your own stack (React, Vue, plain JS, etc.) — nothing is locked in
  yet. Once chosen, add setup/run instructions here.

## Getting started

_TODO: once the stack is chosen, add install + run instructions here._
