/**
 * Every number in this file came out of a real run against the local stack on
 * 2026-08-22, or out of the Calafai strategy analysis (CAL-ROADWATCH-2026-AUG-22).
 * Nothing here is invented for the video.
 *
 * Re-captured after merging origin/main, which added the street-permit lookup —
 * hence six stages, not five, and a report that names the contractor.
 */

/** Live `pipeline` trace from POST /analyze-image on imgs/IMG_5582.webp. */
export const PIPELINE = [
  { name: "see", label: "Classify the hazard", model: "mistral-small-latest", ms: 2847 },
  { name: "ocr", label: "Read text in frame", model: "mistral-ocr-latest", ms: 449 },
  { name: "locate", label: "Resolve the street", model: "nominatim", ms: 114 },
  { name: "permit", label: "Find open street work", model: "sfgov:x8nh-xzn6", ms: 662 },
  // `model` here reads "sf311 + roadar" ahead of the backend: app/main.py still
  // emits "sf311 + roadwatch" for this stage. Rename it there and this is verbatim.
  { name: "check", label: "Check for duplicates", model: "sf311 + roadar", ms: 1708 },
  { name: "act", label: "Write the civic report", model: "mistral-small-latest", ms: 1346 },
] as const;

export const PIPELINE_TOTAL_MS = PIPELINE.reduce((a, b) => a + b.ms, 0); // 7126

/** How many of those six stages are actually Mistral calls. */
export const MODEL_CALL_COUNT = PIPELINE.filter((s) =>
  s.model.startsWith("mistral"),
).length; // 3

/** The seven-step agent loop exposed at GET /agent-loop. */
export const AGENT_LOOP = [
  { step: "SEE", q: "What happened?" },
  { step: "UNDERSTAND", q: "How serious is it?" },
  { step: "LOCATE", q: "Where is it?" },
  { step: "CHECK", q: "Already reported?" },
  { step: "PRIORITIZE", q: "How is it ranked?" },
  { step: "ROUTE", q: "Whose job is it?" },
  { step: "ACT", q: "What do they need?" },
] as const;

/** Verbatim response fields for the hazard the demo walks through. */
export const RESULT = {
  hazardType: "Road debris",
  severity: "Urgent",
  confidence: 0.98,
  priorityScore: 90,
  laneImpact: "partial",
  locationLabel: "Stevenson Street, South of Market",
  locationConfidence: "high",
  ocrText: "www.usps.com",
  civicCategory: "Street and Sidewalk Cleaning",
  targetAgency: "San Francisco Public Works via SF311",
  status: "detected",
  humanReviewRequired: true,
  description: "Remove the detached tire and wheel rim from the travel lane.",
  report:
    "A detached tire and wheel rim are obstructing part of the travel lane on Stevenson Street. The debris poses a hazard to traffic and should be removed promptly. The nearby active street permit (Excavation #26EXC-03895) is managed by CableCom, who may assist with coordination if needed. Contact SF311 to report.",
} as const;

/**
 * The street-use permit the `permit` stage matched, from SF's open dataset
 * (x8nh-xzn6). The contractor's phone is in the response and on the hazard page;
 * it is redacted in the capture and deliberately not repeated here.
 */
export const PERMIT = {
  street: "STEVENSON ST",
  contractor: "CableCom",
  number: "26EXC-03895",
  type: "Excavation",
  status: "ACTIVE",
  distanceM: 226,
} as const;

/** The clean-street control run — same endpoint, same prompt, no hazard. */
export const NEGATIVE = {
  hazardDetected: false,
  hazardType: "none",
  confidence: 1.0,
  reasoning:
    "The pavement appears intact with no potholes, cracks, or debris. No vehicles are blocking travel lanes, and there is no standing water or collision damage.",
} as const;

/** Calafai strategy analysis, chapter 3 — the queueing model. */
export const STORM = {
  manualLimit: 12.5,
  stormArrivals: 22,
  withRoadwatch: 75,
  hoursReturned: 403,
  manualMinutes: 12,
  roadarMinutes: 2,
  windowHours: 2.5,
} as const;

/** Calafai strategy analysis, chapter 2 — bottom-up market sizing. */
export const MARKET = {
  tam: "$35.8M",
  sam: "$16.1M",
  som: "$504K",
  cityCount: 807,
  notThis: ["$456B public construction", "$4.32B asset-management software"],
} as const;

/** Calafai strategy analysis, chapter 4 — value-ceiling pricing. */
export const VALUE = {
  ceiling: 67.9,
  license: 36,
  surplus: 31.9,
  components: [
    { label: "Claims posture", value: 37.5 },
    { label: "Triage labour + handoff", value: 14.5 },
    { label: "Redundant truck rolls", value: 11.9 },
    { label: "Storm surge staffing", value: 4.0 },
  ],
} as const;

/** Calafai strategy analysis, chapter 2 — the competitive gap table. */
export const LANDSCAPE = [
  { player: "RoadBotics, StreetScan", fresh: 0.12, routed: 0.55, note: "Annual to biennial scans" },
  { player: "311, Accela, SeeClickFix", fresh: 0.34, routed: 0.72, note: "Waits for a citizen to file" },
  { player: "Cityworks, Cartegraph", fresh: 0.05, routed: 0.93, note: "Detects nothing of its own" },
  { player: "Waymo × Waze feed", fresh: 0.74, routed: 0.16, note: "A pin on a map" },
  { player: "Freeway incident detection", fresh: 0.96, routed: 0.3, note: "Freeway only" },
] as const;
