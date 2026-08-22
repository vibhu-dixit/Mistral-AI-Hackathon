# Voiceover script — RoadWatch demo

The video renders silent. This script is timed to the cut, at a conversational
~150 words/minute. Scene boundaries are the `Series` entries in
`remotion/src/Video.tsx` — if you retime a scene there, retime the line here.

Total runtime **2:33.6** (4608 frames @ 30fps).

| # | Scene | In | Out | Line |
|---|---|---|---|---|
| 1 | `title` | 0:00 | 0:05.5 | "This is RoadWatch. It turns an ordinary street photo into a municipal hazard report — deduplicated, severity-scored, and routed to a named department." |
| 2 | `problem-chain` | 0:05.5 | 0:13 | "Cities can't inspect every road continuously. Today a hazard only gets fixed if a human sees it, identifies it, categorises it, reports it, and tracks it. Every link is a place it gets dropped." |
| 3 | `problem-scale` | 0:13 | 0:21 | "San Francisco alone logs four to six hundred pothole requests a month — triple that in storms. One physical hazard generates three to eight duplicate tickets, and the duplicate check that would catch them takes five to fifteen minutes and is the first thing skipped when it's busy." |
| 4 | `demo-capture` | 0:21 | 0:28 | "So here's the whole input: point a phone at the street. It's mobile web — no install. The browser sends the photo plus GPS, and EXIF coordinates take priority when the image carries them." |
| 5 | `demo-pipeline` | 0:28 | 0:38 | "This is a real run against our local stack. Five calls: Mistral vision classifies the hazard, Mistral OCR reads text in frame, we resolve the street, we check for duplicates against our own rows and the live SF311 feed, and a Mistral agent writes the municipal report. Seven point three seconds, end to end." |
| 6 | `demo-agent-loop` | 0:38 | 0:46 | "It isn't one prompt. It's seven questions in order — what happened, how serious, where, already reported, how is it ranked, whose job is it, what do they need. Every step is inspectable in the response." |
| 7 | `demo-result` | 0:46 | 0:55 | "The photo comes back as a typed record. Road debris, urgent, ninety-eight percent confidence, Stevenson Street, priority eighty-five out of a hundred, and the SF311 category. The same object drives the UI on the right." |
| 8 | `demo-report` | 0:55 | 1:04 | "Then it's routed — San Francisco Public Works via SF311. The department comes from a lookup table, not the model; the model only writes the prose. Critical hazards and collisions never auto-submit." |
| 9 | `demo-dedupe` | 1:04 | 1:13 | "A second report at the same spot doesn't become a second ticket. The proximity check runs before anything is written, and the new sighting links to the open event. This is the part that makes the queue believable to the person working it." |
| 10 | `demo-negative` | 1:13 | 1:20 | "And it doesn't cry wolf. A clean street comes back hazard-detected false. Normal cracks, wet pavement and parked cars are explicitly not hazards, and nothing gets persisted." |
| 11 | `demo-map` | 1:20 | 1:27 | "Everything lands on one prioritised public map, filterable by hazard type, severity and status." |
| 12 | `market-intro` | 1:27 | 1:33 | "So who buys this, and for how much? We ran the market, operations and pricing analysis on the Calafai platform." |
| 13 | `market-wedge` | 1:33 | 1:43 | "Detection is commoditising — the action layer is the product. Scan vendors are calibrated but a year out of date. Work-order systems detect nothing. When Waymo and Waze pushed five hundred potholes to five US metros this April, cities got a pin on a map: no dedupe, no severity, no department. Fast *and* routed is unoccupied." |
| 14 | `market-storm` | 1:43 | 1:53 | "Here's the fact we'd lead with. One coordinator can hand-triage about twelve and a half events a day. A storm week delivers twenty-two. The desk breaks exactly when the city needs it most — and that's why the severity split isn't a preference, it's the correct answer. Four hundred and three coordinator hours back per year." |
| 15 | `market-size` | 1:53 | 2:02 | "On market size we're pitching the honest number: thirty-five point eight million a year in US licence revenue, bottom-up from eight hundred and seven cities. Not the four-hundred-billion construction budget. A bounded number that survives diligence beats a hand wave." |
| 16 | `market-value` | 2:02 | 2:11 | "A city of two-fifty thousand buys about sixty-eight thousand dollars of value a year. We price at thirty-six, so the surplus is visible. And we'll say the uncomfortable part: the claims component is the biggest and the least certain, so we validate it with a city risk office before quoting." |
| 17 | `market-privacy` | 2:11 | 2:19 | "One thing we state before anyone asks. This is an infrastructure camera, not a surveillance camera. No person identification anywhere in the pipeline, city-owned lenses first, and we never contact emergency services." |
| 18 | `recap` | 2:19 | 2:26 | "Three Mistral models — vision, OCR and an agent — plus a duplicate check and a full capture-to-submit surface." |
| 19 | `close` | 2:26 | 2:33.6 | "From any camera to city action. Thanks to Calafai, who gave us the credits to run the strategy analysis." |

## Notes for recording

- Scenes 5, 9, 14 and 16 are the ones judges remember. Slow down there.
- Scene 14 ("the desk breaks on the worst day") is the single strongest beat in
  the market half — the Calafai analysis calls it the killer fact. Land it.
- Scene 16's caveat is deliberate. Volunteering the weakest assumption reads as
  rigour; a procurement analyst will find it anyway.
- If you run long, cut scene 11 (`demo-map`, 7s) and scene 18 (`recap`, 8s)
  first. Never cut 5, 9 or 14.
