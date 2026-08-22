# `recordings/` — raw product walkthroughs

Screen recordings of the real app, captured against the live stack. These are
**not** the demo video (`demo/`) — no narration, no titles, no editing. Just the
product doing the thing, for embedding in a submission or checking a flow.

| file | viewport | length | what it shows |
|---|---|---|---|
| `01-user-flow-mobile-report.mp4` | 430×932 | 20.9s | The reporting flow. Home → Analyze → pick a photo → GPS captured → analyse → hazard card → View on map. |
| `02-user-flow-desktop-triage.mp4` | 1440×900 | 15.6s | The triage flow. Map → open a hazard → permit + AI reasoning → generated report → submit. |

Captured with Playwright's video recorder, so the frame is the browser viewport
only — no OS chrome, no cursor artefacts. Re-encoded to H.264 for portability.

## Reproducing

Both servers must be up:

```bash
# backend
cd backend && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8010

# web app (production build — see the note below)
cd web-app && npm run build && npm run start -- -p 3000
```

Then drive it with Playwright (`record_video_dir` on the context). Two things
that will bite you:

**Wait for the GPS fix before clicking "Analyze Drive".** The button is only
disabled while `status === "requesting"`, so a script can click through before
coordinates land. The request then goes out with no coordinates and the backend
falls back to geocoding whatever the OCR read — which for a USPS truck resolves
to a random post office. Gate on the "Location captured" text.

**Use a production build for anything showing the upload preview.** In `next dev`
React StrictMode revokes the object URL before the image loads, so the preview
renders as a broken image. See `demo/README.md`.

## Redaction

The permit block and the generated report both carry the contractor's phone
number, from SF's public street-use permit dataset. It is masked in
`02-user-flow-desktop-triage.mp4` — as a `tel:` link *and* inside the report
prose, where the agent writes it into the sentence. A shareable recording
shouldn't carry a working number.

If you re-record, redact both. Masking only the `tel:` link is not enough.
