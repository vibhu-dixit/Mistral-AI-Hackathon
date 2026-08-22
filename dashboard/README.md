# Dashboard/Data Viz

## Scope

- Public map interface
- Prioritization algorithm (severity + report count + time open)
- Status tracking UI, filters
- Consumes the same API as the web app — read-heavy (`GET /api/reports`),
  see [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md)

## Notes

- You don't need a live backend to start. Mock `GET /api/reports` with a
  handful of sample `Report` objects (see the API contract) and swap in the
  real base URL once Backend has something running.
- Prioritization is a client-side (or backend-side, TBD) ranking, not a new
  endpoint necessarily — start with something simple: a weighted score of
  severity + report_count + time-since-created, and iterate.
- Pick your own stack (React + a map library like Mapbox/Leaflet, etc.) —
  nothing is locked in yet. Once chosen, add setup/run instructions here.

## Getting started

_TODO: once the stack is chosen, add install + run instructions here._
