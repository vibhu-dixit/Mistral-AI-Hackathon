import type { Hazard } from "@/lib/types";

/**
 * Skeleton data — real field shapes, placeholder content. Deliberately
 * covers every UI state at once (all 4 hazard types, all 3 severities, a
 * duplicate case, a null-image case, and every status) so every screen can
 * be built and demoed against this before the real /analyze-* endpoints
 * exist. See PLAN.md §5.2.
 */
export const MOCK_HAZARDS: Hazard[] = [
  {
    id: "hz-001",
    hazard_type: "pothole",
    severity: "urgent",
    confidence: 0.94,
    latitude: 37.7766,
    longitude: -122.4136,
    location_label: "Folsom St & 8th St, San Francisco",
    description:
      "Large pothole located in the westbound traffic lane near Folsom St and 8th St. The defect appears approximately 18–24 inches across and may pose a hazard to vehicles and cyclists.",
    ai_reasoning:
      "Defect occupies a significant portion of the vehicle wheel path and appears deep enough to potentially damage vehicles or affect cyclists.",
    image_url: null,
    priority_score: 87,
    votes: 184,
    duplicate: false,
    target_category: "Street defect",
    generated_report:
      "Large pothole located in the westbound traffic lane near Folsom St and 8th St. The defect appears approximately 18–24 inches across and may pose a hazard to vehicles and cyclists.",
    status: "report_ready",
    detected_at: "2026-08-17T10:34:00-07:00",
  },
  {
    id: "hz-002",
    hazard_type: "pothole",
    severity: "routine",
    confidence: 0.81,
    latitude: 37.7793,
    longitude: -122.4192,
    location_label: "Van Ness Ave & Post St, San Francisco",
    description:
      "Moderate pavement damage in the right lane, roughly 8 inches across. Not currently obstructing traffic flow.",
    ai_reasoning:
      "Shallow, localized damage consistent with routine wear. No visible obstruction to the travel lane.",
    image_url: null,
    priority_score: 34,
    votes: 12,
    duplicate: false,
    target_category: "Street defect",
    generated_report:
      "Moderate pothole in the right travel lane near Van Ness Ave and Post St, approximately 8 inches across. Recommend routine repair scheduling.",
    status: "detected",
    detected_at: "2026-08-18T08:12:00-07:00",
  },
  {
    id: "hz-003",
    hazard_type: "debris",
    severity: "urgent",
    confidence: 0.89,
    latitude: 37.7841,
    longitude: -122.4079,
    location_label: "Market St & 5th St, San Francisco",
    description:
      "Large object obstructing approximately one third of the right lane, appears to be fallen construction material.",
    ai_reasoning:
      "Object footprint is large enough to force merging traffic; material appears rigid and could damage vehicles on contact.",
    image_url: null,
    priority_score: 71,
    votes: 96,
    duplicate: true,
    duplicate_distance_m: 9,
    target_category: "Roadway obstruction",
    generated_report:
      "Large debris obstructing roughly one third of the right lane on Market St near 5th St. Appears to be fallen construction material posing a hazard to vehicles and cyclists.",
    status: "reported",
    detected_at: "2026-08-19T14:02:00-07:00",
  },
  {
    id: "hz-004",
    hazard_type: "blocked_lane",
    severity: "critical",
    confidence: 0.97,
    latitude: 37.7712,
    longitude: -122.4241,
    location_label: "Mission St & 16th St, San Francisco",
    description:
      "Stalled vehicle fully occupying the right lane during peak traffic hours, forcing all traffic into a single lane.",
    ai_reasoning:
      "Complete lane obstruction combined with high traffic volume creates an immediate safety and congestion risk. Flagged for human review rather than automatic dispatch.",
    image_url: null,
    priority_score: 96,
    votes: 231,
    duplicate: false,
    target_category: "Traffic hazard",
    generated_report:
      "Stalled vehicle fully blocking the right travel lane on Mission St near 16th St, forcing all traffic into a single lane during peak hours. Immediate attention recommended.",
    status: "in_progress",
    detected_at: "2026-08-20T17:45:00-07:00",
  },
  {
    id: "hz-005",
    hazard_type: "flooding",
    severity: "critical",
    confidence: 0.92,
    latitude: 37.7595,
    longitude: -122.4148,
    location_label: "Cesar Chavez St & Mission St, San Francisco",
    description:
      "Severe standing water covering both southbound lanes, roadway appears partially inaccessible.",
    ai_reasoning:
      "Water depth and lane coverage suggest vehicles may lose traction or stall; roadway is effectively impassable in the affected direction.",
    image_url: null,
    priority_score: 92,
    votes: 158,
    duplicate: false,
    target_category: "Drainage / flooding",
    generated_report:
      "Severe flooding covering both southbound lanes at Cesar Chavez St and Mission St. Roadway is partially inaccessible and poses a hazard to vehicles.",
    status: "report_ready",
    detected_at: "2026-08-21T07:20:00-07:00",
  },
  {
    id: "hz-006",
    hazard_type: "flooding",
    severity: "routine",
    confidence: 0.68,
    latitude: 37.7649,
    longitude: -122.4194,
    location_label: "Dolores St & 18th St, San Francisco",
    description:
      "Minor pooling near the curb after recent rainfall, not currently affecting the travel lane.",
    ai_reasoning:
      "Pooling is confined to the gutter area; no evidence of lane encroachment.",
    image_url: null,
    priority_score: 21,
    votes: 7,
    duplicate: false,
    target_category: "Drainage / flooding",
    generated_report:
      "Minor standing water near the curb on Dolores St at 18th St following recent rainfall. No current impact to the travel lane.",
    status: "resolved",
    detected_at: "2026-08-10T09:15:00-07:00",
  },
  {
    id: "hz-007",
    hazard_type: "debris",
    severity: "routine",
    confidence: 0.77,
    latitude: 37.7699,
    longitude: -122.4469,
    location_label: "Lincoln Way & 9th Ave, San Francisco",
    description:
      "Small fallen branch near the curb, not obstructing the travel lane.",
    ai_reasoning:
      "Object is small and positioned outside the primary wheel path; low risk to traffic.",
    image_url: null,
    priority_score: 18,
    votes: 4,
    duplicate: false,
    target_category: "Roadway obstruction",
    generated_report:
      "Small debris (fallen branch) near the curb on Lincoln Way at 9th Ave. Minimal impact to traffic.",
    status: "detected",
    detected_at: "2026-08-21T16:50:00-07:00",
  },
];
