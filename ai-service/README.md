# AI/ML Integration (Mistral)

## Scope

- Prompt design for severity assessment from pothole images
- Logic to map location → responsible municipal department/contractor
  (likely a lookup table or GIS layer, not just AI reasoning — start there
  before assuming a prompt alone can do it)
- Exposes a clean function/endpoint: `image + coordinates → {severity, category, responsible_party}`

## Interface (see [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md))

```
POST /analyze
Request:  { "photo_url": "string", "lat": "number", "lng": "number" }
Response: { "severity": "low|medium|high|critical", "category": "string", "responsible_party": "string" }
```

This is called internally by the backend — it doesn't need to be
public-facing. You can build and test this standalone (hit it with sample
photo URLs + coordinates) without waiting on backend integration.

## Notes on the hard part

Location → responsible party is explicitly the trickiest piece. A few
directions worth comparing early rather than late:
- A static lookup table (e.g. by district/zip/ward → department) — fastest
  to ship, good enough for a demo.
- A GIS layer / municipal boundary dataset if one is available for the demo
  city.
- Mistral reasoning over the two above as a fallback/tiebreaker, not as the
  primary source of truth.

## Getting started

_TODO: add setup/run instructions (Mistral API key handling, model choice,
sample data) here once decided. Keep API keys in `.env`, never commit them —
see the repo `.gitignore`._
