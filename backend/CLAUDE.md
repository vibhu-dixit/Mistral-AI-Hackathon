# Agent context — Backend/API

You're working on report ingestion, the database schema, routing, and the
integration glue between the AI service, geocoding, and the dashboard. This
folder owns the data model — `../docs/API_CONTRACT.md` should be treated as
close to source-of-truth, and kept in sync with whatever schema actually
gets built.

- Endpoints to implement: see `README.md` in this folder for the full list.
  `POST /api/reports` must not block the response on AI analysis — persist
  the report first, process severity/category/responsible_party async, then
  `PATCH` the record.
- The AI/ML service is a separate internal call (`POST /analyze` on the
  `ai-service` workstream) — don't reimplement severity/category logic here,
  call out to it.
- If you change the schema or endpoint shapes, update
  `../docs/API_CONTRACT.md` in the same change and flag it — web app and
  dashboard build against that file directly.
- No stack is chosen yet. If the user hasn't specified one, ask before
  scaffolding (Node/Express vs. Python/FastAPI vs. something else changes
  the whole folder layout) rather than guessing.
