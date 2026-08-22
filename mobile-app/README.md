# Mobile/Frontend — Reporting App

## Scope

- Photo capture UI
- GPS/EXIF geotagging (pull coordinates from the photo or device location)
- Report submission flow → confirmation screen → tracking ID lookup
- Talks to the backend via API only (see [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md))

## Notes

- You don't need a live backend to start. Mock `POST /api/reports` and
  `GET /api/reports/:tracking_id` against the shapes in the API contract
  (e.g. a local JSON file or `json-server`), and swap in the real base URL
  once Backend has something running.
- The confirmation screen should surface the `tracking_id` prominently —
  it's how the citizen looks up status later.
- Pick your own stack (React Native, Flutter, plain web, etc.) — nothing is
  locked in yet. Once chosen, add setup/run instructions here.

## Getting started

_TODO: once the stack is chosen, add install + run instructions here._
