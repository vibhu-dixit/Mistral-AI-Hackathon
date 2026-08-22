# `demo/` — Roadar demo video

A 2:33 Remotion video: end-to-end product demo first, market analysis second.

```
demo/
├─ remotion/            Remotion project (the video source)
│  ├─ src/
│  │  ├─ data.ts        every figure used on screen, with provenance
│  │  ├─ theme.ts       tokens copied from web-app/src/app/globals.css
│  │  ├─ Video.tsx      scene order + durations — edit the cut here
│  │  └─ scenes/        one file per act
│  ├─ public/shots/     only the 3 captures the video actually uses
│  └─ out/              rendered mp4 + per-scene stills (gitignored)
├─ screenshots/         the full capture set, for slides / README / re-cuts
└─ VOICEOVER.md         timed narration script
```

`public/shots/` is deliberately a subset — Remotion bundles everything under
`public/`, so only what's on screen lives there. If you put a new screenshot in
a scene, copy it across from `screenshots/` first.

## Watch it

`remotion/out/roadar-demo.mp4` — 1920×1080, 30fps, 22 MB.

## Work on it

```bash
cd demo/remotion
npm install
npm run dev        # Remotion Studio, scrub the timeline
npm run render     # → out/roadar-demo.mp4
```

Every scene is also registered as its own composition (`scene-demo-pipeline`,
`scene-market-storm`, …) so you can re-cut one beat without scrubbing the whole
timeline:

```bash
npx remotion still scene-market-storm out/check.png --frame=170
```

To change the cut, edit the `SCENES` array in `src/Video.tsx`. Durations are in
seconds; `TOTAL_FRAMES` recomputes itself, including the transition overlap.

## Where the numbers come from

`src/data.ts` is the single source for everything on screen. Two origins:

**Live run against the local stack, 2026-08-22.** `PIPELINE`, `RESULT`,
`PERMIT`, `NEGATIVE` and `AGENT_LOOP` are verbatim from `POST /analyze-image`
and `GET /agent-loop` with `backend` on `:8010`. The per-stage millisecond
timings (2847 / 449 / 114 / 662 / 1708 / 1346 ms) are that run's real `pipeline`
array, not illustrative numbers. Inputs were `imgs/IMG_5582.webp` (hazard) and
`imgs/IMG_5579.webp` (clean street control).

Re-captured after merging `origin/main`, which added the street-permit lookup.
That made the trace **six** stages, not five, and the generated report now names
the contractor holding the nearby excavation permit. Only three of the six are
Mistral calls (`see`, `ocr`, `act`) — the pipeline headline says so rather
than calling all six "model calls".

Dedupe is keyed on `hazard_type` (`app/duplicates.py` → `search_hazards`), so a
re-upload only links when the classifier returns the same type. Verified: the
same photo twice at the same coordinates returns `duplicate: true`,
`linked_to_existing: true`, `distance_meters: 0.0`.

**Calafai strategy analysis** (`CAL-ROADWATCH-2026-AUG-22`). `STORM`, `MARKET`,
`VALUE` and `LANDSCAPE`. The deck's own slide 18 names what to use for a
hackathon — middleware thesis, the storm-week fact, the honest $36M wedge,
privacy posture stated first — and the market act is built to exactly that list
rather than dumping the whole report.

`LANDSCAPE` x/y values are *visual* positions for the 2×2, derived from the
report's qualitative freshness/routing table. They are not measured scores.

## Regenerating the screenshots

`screenshots/` was captured with Playwright against `web-app` on `:3000` and
`backend` on `:8010`, with geolocation granted at 37.7793, −122.4132.

One gotcha: **capture `04-analyze-preview.png` against a production build**
(`next build && next start`), not `next dev`. In dev, React StrictMode
double-invokes the effect in `web-app/src/components/upload/MediaPreview.tsx`,
which revokes the object URL before the image loads — the preview renders as a
broken-image icon. Production is unaffected.

### The navbar crop

The app still ships as **RoadWatch**; the video is **Roadar**. So the three
captures under `public/shots/` are cropped copies with the nav strip removed,
rather than the raw files in `screenshots/`:

| file | cut from top |
|---|---|
| `04-analyze-preview.png` | 165 px (3× capture) |
| `07-hazard-detail.png` | 110 px (2× capture) |
| `10-dashboard-map.png` | 110 px (2× capture) |

That's 55 logical px in every case — the nav's height including its gradient rule
and bottom border. Re-measure after any nav change; the numbers moved once
already. The frames read as a scrolled page, which is why no scene depends on the
site header.

**When `web-app/` is renamed, drop the crop.** Re-capture the three shots and
copy them across uncropped; the wordmark will then agree with the narration.

### Redaction

`07-hazard-detail.png` has the contractor's phone number painted out. It comes
from SF's public street-use permit dataset and the app renders it, but a video
that may be published shouldn't broadcast a working number, and the demo reads
fine without it. `data.ts` deliberately does not carry the value either.

### The dashboard moved

`/dashboard` no longer exists — the dashboard is the home page. The `Browser`
frame in `DemoMap` says `localhost:3000` for that reason. Don't "fix" it back.

## If you re-record with narration

`VOICEOVER.md` has a per-scene script timed to this cut. The video is silent by
design so you can drop a voice track over it without fighting music.
