# API Contract (Draft)

This is the shared contract between all four workstreams. It's a draft — the
**Backend/API** owner has final say and should update this file as the real
schema lands, but everyone else should build against this now instead of
waiting.

If you change something here, ping the channel — web app/dashboard may
already be mocking against it.

## Core data model: `Report`

```json
{
  "id": "string (uuid)",
  "tracking_id": "string (short human-friendly code, e.g. PH-7F3K)",
  "photo_url": "string (url)",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "created_at": "string (ISO 8601)",
  "status": "submitted | acknowledged | in_progress | resolved",
  "severity": "low | medium | high | critical | null",
  "category": "string | null",
  "responsible_party": "string | null",
  "report_count": "number (how many citizen reports reference this pothole)"
}
```

Notes:
- `severity`, `category`, `responsible_party` start `null` at submission and
  get filled in once the AI/ML service has processed the photo — reports are
  created optimistically, not blocked on AI inference.
- `tracking_id` is what's shown to the citizen on the confirmation screen for
  status lookup — keep it short and typo-resistant.

## Backend/API endpoints (web app + dashboard consume these)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/reports` | Submit a new report (photo + GPS coords). Returns `Report` with `tracking_id`. |
| `GET` | `/api/reports/:tracking_id` | Look up a single report's status (citizen tracking screen). |
| `GET` | `/api/reports` | List reports, filterable by `status`, `severity`, bounding box — used by the dashboard. |
| `PATCH` | `/api/reports/:id` | Update status/severity/etc — called internally after AI processing, and by city staff. |

## AI/ML service interface (backend calls this internally)

Exposed by the AI/ML workstream, called by the backend after a report is
created:

```
POST /analyze
Request:  { "photo_url": "string", "lat": "number", "lng": "number" }
Response: { "severity": "low|medium|high|critical", "category": "string", "responsible_party": "string" }
```

This does not need to be public-facing — it's an internal service the backend
calls. The AI/ML owner can stand this up standalone and test it independently
of the backend integration.

## Mocking before the real thing exists

Web App and Dashboard should not wait on Backend to build real endpoints.
Stand up a mock (e.g. a static JSON file, `json-server`, or a few hardcoded
responses) matching the shapes above and swap in the real base URL once
Backend has something running.
