# API Contract — RoadWatch (image MVP)

Shared contract for the web app, dashboard, AI service, and backend.

**Scope:** still images only. Video / frame extraction is deferred.

## Core analysis object

Returned by `POST /analyze-image` and stored on `hazards`.

```json
{
  "hazard_type": "pothole",
  "severity": "urgent",
  "confidence": 0.94,
  "latitude": 37.775,
  "longitude": -122.413,
  "description": "Large pothole in the westbound wheel path.",
  "priority_score": 87,
  "duplicate": false,
  "target_category": "Street Defect",
  "generated_report": "Large pothole located...",
  "hazard_detected": true,
  "lane_impact": "partial",
  "location_label": "Folsom St & 8th St, San Francisco",
  "location_confidence": "high",
  "ocr_text": "FOLSOM",
  "ai_reasoning": "Defect occupies the vehicle wheel path and appears deep.",
  "civic_category": "Street Defect",
  "target_agency": "San Francisco Public Works via SF311",
  "agent": "Esquivel Grading & Paving, Inc.",
  "agent_phone": "415-468 5700",
  "human_review_required": false,
  "status": "report_ready",
  "hazard_id": "uuid",
  "image_url": "https://...",
  "duplicate_match": null,
  "nearby_reports": [],
  "pipeline": []
}
```

### Enums

| Field | Values |
|---|---|
| `hazard_type` | `pothole`, `road_debris`, `blocked_lane`, `flooding`, `collision`, `damaged_signage`, `none` |
| `severity` | `routine`, `urgent`, `critical` |
| `status` | `detected`, `report_ready`, `reported`, `in_progress`, `resolved` |
| `lane_impact` | `none`, `partial`, `full` |

`collision` is always `human_review_required: true`. RoadWatch does not contact emergency services.

## Backend endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness |
| `GET` | `/agent-loop` | SEE → UNDERSTAND → LOCATE → CHECK → PRIORITIZE → ROUTE → ACT |
| `POST` | `/analyze-image` | Upload a photo + optional GPS. Runs Mistral vision → OCR → locate → duplicate check → civic report. |
| `GET` | `/analyze-image/schema` | Shared 10-field contract |
| `GET` | `/api/hazards` | List stored hazards for the map |
| `GET` | `/api/hazards/:id` | Hazard + reports + observations |
| `PATCH` | `/api/hazards/:id` | Update `status` |
| `POST` | `/api/hazards/:id/submit` | Simulated SF311 submit (`RW-SIM-...`). Never auto-submits critical/collision. |
| `POST` | `/api/observations` | Capture-client image upload. EXIF GPS, then client GPS. Same Mistral pipeline. |
| `GET` | `/api/observations` | List recent in-memory observations |
| `GET` | `/api/observations/:id` | One observation |

### `POST /analyze-image`

`multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `file` | image file | yes |
| `latitude` | float | no (falls back to EXIF GPS) |
| `longitude` | float | no |
| `force_new` | bool | no — if a nearby RoadWatch duplicate exists, link a new sighting instead of creating a row. Set true to force a new hazard. |

The response includes:

- `contract` — the 10 shared fields for other workstreams
- `agent_loop` — Ibrahim's demo trace (see / understand / locate / check / prioritize / route / act)
- `pipeline` — timed model calls

If no hazard is present, `hazard_detected` is `false` and nothing is stored.

## Image observation pipeline

Capture-client handoff used by `web-app/`. EXIF GPS is authoritative when present; client GPS is the fallback. OCR is corroborating evidence and does not replace coordinates.

`POST /api/observations` (multipart form data)

- `image`: required image file
- `client_lat`: optional number
- `client_lng`: optional number

Response:

```json
{
  "id": "uuid",
  "asset_name": "road.jpg",
  "coordinates": { "latitude": 37.7749, "longitude": -122.4194 },
  "location_source": "exif | client_gps | ocr | unavailable",
  "location_confidence": 0.0,
  "ocr_text": null,
  "hazard_type": "pothole",
  "severity": "routine | urgent | critical | null",
  "confidence": 0.0,
  "description": "string",
  "processing_status": "queued | processing | complete | failed",
  "generated_report": "string | null",
  "duplicate": false,
  "hazard_id": "uuid | null",
  "agent": "string | null",
  "agent_phone": "string | null",
  "created_at": "ISO 8601"
}
```

This endpoint runs the same Mistral pipeline as `POST /analyze-image`.

`GET /api/observations` lists in-memory findings. `GET /api/observations/:id` returns one finding.



## Agent loop

`pipeline` on the response is the demo trace:

1. **locate** — GPS / EXIF + Nominatim road name
2. **see** — Mistral vision (`mistral-small-latest`)
3. **ocr** — Mistral OCR (`mistral-ocr-latest`)
4. **check** — nearby RoadWatch rows + SF311
5. **permit** — SF Active Street Use Permits SODA (`x8nh-xzn6`) → `agent`, `agent_phone`
6. **act** — Mistral agent writes category, priority, municipal report

`agent` / `agent_phone` are the contractor on the matching street-use permit (null when GPS is missing or no permit matches). The locate step also includes these fields.
