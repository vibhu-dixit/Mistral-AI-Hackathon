/**
 * Every number in this file came out of a real run against the local stack on
 * 2026-08-22, or out of the Calafai strategy analysis (CAL-ROADWATCH-2026-AUG-22).
 * Nothing here is invented for the video.
 */

/** Live `pipeline` trace from POST /analyze-image on imgs/IMG_5582.webp. */
export const PIPELINE = [
  { name: "see", label: "Classify the hazard", model: "mistral-small-latest", ms: 2976 },
  { name: "ocr", label: "Read text in frame", model: "mistral-ocr-latest", ms: 1015 },
  { name: "locate", label: "Resolve the street", model: "nominatim", ms: 225 },
  { name: "check", label: "Check for duplicates", model: "sf311 + roadwatch", ms: 1837 },
  { name: "act", label: "Write the civic report", model: "mistral-small-latest", ms: 1214 },
] as const;

export const PIPELINE_TOTAL_MS = PIPELINE.reduce((a, b) => a + b.ms, 0); // 7267

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
  priorityScore: 85,
  laneImpact: "partial",
  locationLabel: "Stevenson Street, South of Market",
  locationConfidence: "high",
  ocrText: "www.usps.com",
  civicCategory: "Street and Sidewalk Cleaning",
  targetAgency: "San Francisco Public Works via SF311",
  status: "report_ready",
  humanReviewRequired: false,
  description:
    "A detached vehicle underbody panel or splash guard lying on the asphalt.",
  report:
    "A detached vehicle underbody panel or splash guard is lying on the asphalt on Stevenson Street, South of Market. This debris poses a potential hazard to passing vehicles and could cause damage or be a tripping hazard for cyclists or pedestrians.",
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
  roadwatchMinutes: 2,
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
