# AI/ML Integration (Mistral) — Member 1

Image-only hazard pipeline used by the backend.

Video / frame extraction is **out of scope**.

## What it does

`mistral_pipeline.analyze_photo(image_bytes, lat, lng)` runs:

1. **SEE** — Mistral vision classifies a supported road hazard
2. **OCR** — Mistral OCR reads street / sign text
3. **LOCATE** — GPS, EXIF, Nominatim road name (wired by the backend)
4. **PERMIT** — SF Active Street Use Permits → contractor `agent` / `agent_phone`
5. **CHECK** — duplicate lookup (wired by the backend)
6. **ACT** — Mistral agent produces category, priority, municipal report

Supported types: `pothole`, `road_debris`, `blocked_lane`, `flooding`  
Stretch (classified, always human-review): `collision`, `damaged_signage`

## Setup

From the repo root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -e ..\ai-service
```

Requires `MISTRAL_API_KEY` in the repo-root `.env`.
