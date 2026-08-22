# Backend/API

## Scope

- Report ingestion endpoint + database schema
- Routing logic
- Integration glue between the AI service, geocoding, and the dashboard
- Owns the data model everyone else depends on — see
  [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md) and nail the schema early,
  other teams are building against it in parallel.

## Responsibilities

- `POST /api/reports` — accept a photo + GPS coords, persist a `Report`,
  return it with a generated `tracking_id`. Should not block on AI
  processing — create the report, then kick off analysis async.
- `GET /api/reports/:tracking_id` — single report lookup for the citizen
  tracking screen.
- `GET /api/reports` — list/filter for the dashboard (by `status`,
  `severity`, bounding box).
- `PATCH /api/reports/:id` — update a report after AI analysis completes, or
  when city staff change status.
- Calls the AI/ML service's `POST /analyze` after a report is created, and
  writes the result (`severity`, `category`, `responsible_party`) back onto
  the report.

## Notes

- If the API contract needs to change, update
  `../docs/API_CONTRACT.md` in the same PR and flag it — web app/dashboard
  may be mocking against the old shape.
- Pick your own stack (Node/Express, Python/FastAPI, etc.) — nothing is
  locked in yet. Once chosen, add setup/run instructions here.

## Getting started

_TODO: once the stack is chosen, add install + run instructions here._

## Observation pipeline

`POST /api/observations` accepts a multipart `image` and optional
`client_lat`/`client_lng`. EXIF GPS takes precedence over client GPS. The
normalized response includes the coordinates, location source and confidence,
Mistral finding fields, and processing status for downstream routing.

The repository writes to memory by default for local development. Set
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to also insert into the
`backend/supabase/001_observations.sql` schema. The current analysis function is
a deterministic adapter until the Mistral service is connected.
