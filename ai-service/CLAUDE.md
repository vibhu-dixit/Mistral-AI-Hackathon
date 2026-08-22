# Agent context — AI/ML Integration (Mistral)

Image-only pipeline. Do **not** add video or frame sampling.

Package: `mistral_pipeline`

- `vision.py` — multimodal hazard classification (JSON)
- `ocr.py` — Mistral OCR, street-name signals
- `agent.py` — civic routing + municipal report
- `pipeline.py` — SEE → OCR → LOCATE → PERMIT → CHECK → ACT
- `geo.py` — EXIF GPS + SF street-name normalization (`LOMBARD ST`)
- `routing.py` — SF311 category lookup table (primary), agent is the writer not the source of truth for department names

Permit contractor lookup (SODA `x8nh-xzn6`) is wired by the backend and exposed as `agent` / `agent_phone`.

Never commit `MISTRAL_API_KEY`. Keep prompts conservative: normal cracks, wet pavement, and parked cars are not hazards. Collisions are human-review only — never dispatch emergency services.
