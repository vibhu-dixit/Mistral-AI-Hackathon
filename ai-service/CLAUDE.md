# Agent context — AI/ML Integration (Mistral)

Image-only pipeline. Do **not** add video or frame sampling.

Package: `mistral_pipeline`

- `vision.py` — multimodal hazard classification (JSON)
- `ocr.py` — Mistral OCR, street-name signals
- `agent.py` — civic routing + municipal report
- `pipeline.py` — SEE → OCR → CHECK → ACT
- `routing.py` — SF311 category lookup table (primary), agent is the writer not the source of truth for department names

Never commit `MISTRAL_API_KEY`. Keep prompts conservative: normal cracks, wet pavement, and parked cars are not hazards. Collisions are human-review only — never dispatch emergency services.
