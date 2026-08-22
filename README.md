# Mistral AI Hackathon — RoadWatch

Turn every camera into an autonomous road inspector.

Image-only MVP: upload a street photo, Mistral detects the hazard, SF311
duplicate-check runs, and a municipal report is generated.

See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).

| Area | Folder | Owner | Scope |
|---|---|---|---|
| AI + Backend | [`ai-service/`](ai-service/) + [`backend/`](backend/) | Ibrahim | `POST /analyze-image`, `POST /api/observations`, Mistral vision/OCR/agent, SF311 |
| Frontend | [`web-app/`](web-app/) | Johnathon | Upload + review UI |
| Dashboard | [`dashboard/`](dashboard/) | Johnathon | Map, pins, filters |
| Research / data | [`docs/`](docs/) | Member 3 | Briefing + civic categories |

Video analysis is deferred.
