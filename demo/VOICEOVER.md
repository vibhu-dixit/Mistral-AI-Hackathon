# Voiceover script — Roadar demo

TTS-ready. Numbers are spelled out so ElevenLabs can't misread them, and there
is no markup inside the spoken lines.

Total runtime **2:33.60** (4608 frames @ 30fps). **428 words ≈ 167 wpm**, which
is ElevenLabs' natural pace at speed 1.0.

Windows below are the *real* on-screen times: each transition overlaps its
neighbours by 14 frames, so a scene's start is the running duration total minus
the transitions before it. Regenerate them from the `SCENES` array in
`remotion/src/Video.tsx` if you retime the cut.

## Per-scene blocks

Generate these separately — per-scene clips let you align each one to its window
instead of letting drift compound across one long take.

| # | Scene | In | Out | Window | Words |
|---|---|---|---|---|---|
| 1 | `title` | 0:00.00 | 0:05.53 | 5.53s | 15 |
| 2 | `problem-chain` | 0:05.53 | 0:13.07 | 7.53s | 22 |
| 3 | `problem-scale` | 0:13.07 | 0:21.10 | 8.03s | 25 |
| 4 | `demo-capture` | 0:21.10 | 0:28.13 | 7.03s | 22 |
| 5 | `demo-pipeline` | 0:28.13 | 0:38.17 | 10.03s | 29 |
| 6 | `demo-agent-loop` | 0:38.17 | 0:46.20 | 8.03s | 24 |
| 7 | `demo-result` | 0:46.20 | 0:54.73 | 8.53s | 23 |
| 8 | `demo-report` | 0:54.73 | 1:03.27 | 8.53s | 23 |
| 9 | `demo-dedupe` | 1:03.27 | 1:11.80 | 8.53s | 25 |
| 10 | `demo-negative` | 1:11.80 | 1:19.33 | 7.53s | 21 |
| 11 | `demo-map` | 1:19.33 | 1:25.87 | 6.53s | 15 |
| 12 | `market-intro` | 1:25.87 | 1:31.90 | 6.03s | 17 |
| 13 | `market-wedge` | 1:31.90 | 1:41.43 | 9.53s | 28 |
| 14 | `market-storm` | 1:41.43 | 1:50.97 | 9.53s | 28 |
| 15 | `market-size` | 1:50.97 | 2:00.00 | 9.03s | 25 |
| 16 | `market-value` | 2:00.00 | 2:09.03 | 9.03s | 29 |
| 17 | `market-privacy` | 2:09.03 | 2:17.07 | 8.03s | 23 |
| 18 | `recap` | 2:17.07 | 2:24.60 | 7.53s | 18 |
| 19 | `close` | 2:24.60 | 2:33.60 | 9.00s | 22 |

### 1 · title

> Roadar turns an ordinary street photo into a municipal hazard report. Deduplicated, severity-scored, department-routed.

### 2 · problem-chain

> Cities can't inspect every road. A hazard only gets fixed if a human sees it, names it, files it, and tracks it.

### 3 · problem-scale

> San Francisco logs six hundred pothole reports a month. One hazard spawns up to eight duplicates, and dedupe is the first thing dropped under load.

### 4 · demo-capture

> Here's the whole input: point a phone at the street. Mobile web, no install, and the photo's own GPS tags win when present.

### 5 · demo-pipeline

> This is a real run. Vision classifies the hazard. OCR reads the text. We resolve the street, check for duplicates, and an agent writes the report. Seven point three seconds.

### 6 · demo-agent-loop

> It isn't one prompt. It's seven questions in order. What happened, how serious, where, already reported, whose job, and what do they need.

### 7 · demo-result

> The photo comes back as a typed record. Road debris, urgent, ninety-eight percent confidence, Stevenson Street, priority eighty-five out of a hundred.

### 8 · demo-report

> Then it's routed to San Francisco Public Works. The department comes from a lookup table, not the model. Critical hazards never auto-submit.

### 9 · demo-dedupe

> A second report at the same spot doesn't become a second ticket. The proximity check runs first, and the sighting links to the open event.

### 10 · demo-negative

> And it doesn't cry wolf. A clean street comes back with no hazard. Cracks, wet pavement and parked cars don't count.

### 11 · demo-map

> Everything lands on one prioritized public map, filterable by hazard type, severity, and status.

### 12 · market-intro

> So who buys this, and for how much? We ran the market analysis on the Calafai platform.

### 13 · market-wedge

> Detection is commoditizing. The action layer is the product. Waymo and Waze sent five hundred potholes to five cities. Those cities got a pin on a map. Nothing routed.

### 14 · market-storm

> Here's our strongest fact. One coordinator can hand-triage about twelve events a day. A storm week delivers twenty-two. The desk breaks exactly when the city needs it most.

### 15 · market-size

> We're pitching the honest number. Thirty-six million a year in US license revenue, bottom-up from eight hundred cities. Not the four hundred billion construction budget.

### 16 · market-value

> A city of two hundred fifty thousand buys roughly sixty-eight thousand dollars of value a year. We price at thirty-six thousand. The claims piece is our least certain input.

### 17 · market-privacy

> One thing we say before anyone asks. This is an infrastructure camera, not a surveillance camera. No person identification anywhere in the pipeline.

### 18 · recap

> Three Mistral models. Vision, OCR, and an agent. Plus a duplicate check and a full capture-to-submit flow.

### 19 · close

> From any camera to city action. Roadar. And thanks to Calafai, who gave us the credits to run the strategy analysis.

## Recording notes

- Leave ElevenLabs speed at 1.0. If a clip overruns its window, cut a clause
  rather than speeding it up — sped-up TTS is audibly wrong.
- "SF311" is deliberately not spoken anywhere; TTS reads it as "three hundred
  eleven". Scene 8 says "San Francisco Public Works" instead.
- Scenes 5, 9 and 14 are the beats judges remember. Scene 14 is the strongest
  in the market half — the Calafai analysis calls the storm-week saturation its
  killer fact.
- Scene 16's caveat is deliberate. Volunteering the weakest assumption reads as
  rigour; a procurement analyst finds it anyway.
- Better workflow than trimming to fit: record first, measure each clip, then
  set each scene's `sec` in `remotion/src/Video.tsx` to its clip length. Sync
  becomes exact instead of approximate.
