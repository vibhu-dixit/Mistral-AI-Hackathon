# Mistral AI Hackathon — Pothole Reporter

A civic-tech platform that lets citizens report potholes by taking a photo.
Mistral AI assesses severity from the image, maps the location to the
responsible municipal department/contractor, and routes the report
accordingly. A public dashboard displays and prioritizes reports across the
city for both citizens and officials.

Discord: https://discord.gg/G62ZfzHyx

## How the pieces fit together

```
Mobile App  --POST /api/reports-->  Backend/API  --stores-->  Database
                                          |
                                          |--POST /analyze--> AI/ML Service (Mistral)
                                          |                    (severity, category, responsible_party)
                                          |
Dashboard   <--GET /api/reports---  Backend/API
```

See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) for the shared request/response
shapes — start there before writing any integration code.

## Workstreams

| Area | Folder | Owner | Scope |
|---|---|---|---|
| Mobile/Frontend | [`mobile-app/`](mobile-app/) | TBD | Photo capture, GPS/EXIF geotagging, submission flow, confirmation + tracking ID lookup |
| Backend/API | [`backend/`](backend/) | TBD | Report ingestion endpoint, DB schema, routing/integration glue |
| AI/ML Integration | [`ai-service/`](ai-service/) | TBD | Mistral prompt design (severity), location → responsible party mapping |
| Dashboard/Data Viz | [`dashboard/`](dashboard/) | TBD | Public map, prioritization algorithm, status/filter UI |

Each folder has its own `README.md` (what to build) and `CLAUDE.md` (scoped
context for AI coding agents working in that folder). Fill in the "Owner"
column above once the team claims areas.

## Working agreements

- **Contract first, implementation second.** Backend owns the schema in
  `docs/API_CONTRACT.md` and should nail it early — everyone else builds
  against it (mocked, if needed) rather than waiting on a live backend.
- **Branching:** work on a feature branch per area, e.g. `feature/mobile-app`,
  `feature/backend`, `feature/ai-service`, `feature/dashboard`. Open a PR into
  `main` rather than pushing straight to it.
- **Stay in your lane's folder.** Cross-cutting changes (like editing the API
  contract) are fine, just flag them — other folders may already be mocking
  against the old shape.

## Getting started

1. Clone the repo and check out (or create) your feature branch.
2. Read `docs/API_CONTRACT.md` and your folder's `README.md`.
3. If you're using Claude Code, open your subfolder directly (or point it at
   the repo root — the root `CLAUDE.md` links out to each area's context).
