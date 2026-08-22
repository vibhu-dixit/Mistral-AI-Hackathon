# Agent context — Backend/API (Member 1)

Image-only RoadWatch API. Do **not** add video frame extraction.

- Public contract: `../docs/API_CONTRACT.md`
- AI logic lives in `../ai-service/mistral_pipeline` — import it, don't copy prompts into this folder.
- Endpoints: `POST /analyze-image`, `GET /api/hazards`, `GET /health`
- Duplicate checks: local `hazards` table + SF311 SODA (`vw6y-z8j6`)
- Persist failures must not hide a successful Mistral analysis — return the JSON and set `persist_error`.
