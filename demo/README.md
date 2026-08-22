# `demo/` — RoadWatch demo video

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

`remotion/out/roadwatch-demo.mp4` — 1920×1080, 30fps, 22 MB.

## Work on it

```bash
cd demo/remotion
npm install
npm run dev        # Remotion Studio, scrub the timeline
npm run render     # → out/roadwatch-demo.mp4
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
`NEGATIVE` and `AGENT_LOOP` are verbatim from `POST /analyze-image` and
`GET /agent-loop` with `backend` on `:8010`. The per-stage millisecond timings
(2976 / 1015 / 225 / 1837 / 1214 ms) are that run's real `pipeline` array, not
illustrative numbers. Inputs were `imgs/IMG_5582.webp` (hazard) and
`imgs/IMG_5579.webp` (clean street control).

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

## If you re-record with narration

`VOICEOVER.md` has a per-scene script timed to this cut. The video is silent by
design so you can drop a voice track over it without fighting music.
