export type HazardType =
  | "pothole"
  | "debris"
  | "blocked_lane"
  | "flooding"
  | "collision"
  | "damaged_signage";

export type Severity = "routine" | "urgent" | "critical";

export type HazardStatus =
  | "detected"
  | "report_ready"
  | "reported"
  | "in_progress"
  | "resolved";

export interface Hazard {
  id: string;
  hazard_type: HazardType;
  severity: Severity;
  confidence: number; // 0–1
  latitude: number;
  longitude: number;
  location_label: string; // e.g. "Folsom St & 8th St, San Francisco"
  description: string; // municipal-report-style summary
  ai_reasoning: string; // "why" text shown in the detail view
  image_url: string | null; // null -> ImagePlaceholder renders
  priority_score: number; // 0–100
  duplicate: boolean;
  duplicate_distance_m?: number;
  target_category: string; // e.g. "Street defect"
  generated_report: string;
  status: HazardStatus;
  detected_at: string; // ISO 8601
  votes: number; // net score (upvotes - downvotes) from citizen prioritization
  agent: string | null; // SF street-use permit contractor
  agent_phone: string | null;
}

export interface AnalyzeResponse {
  hazards: Hazard[];
  frame_count?: number; // video only: how many frames were sampled
}

export interface HazardFilters {
  hazard_type?: HazardType[];
  severity?: Severity[];
  status?: HazardStatus[];
}

export const HAZARD_TYPE_LABEL: Record<HazardType, string> = {
  pothole: "Pothole",
  debris: "Road debris",
  blocked_lane: "Blocked lane",
  flooding: "Flooding",
  collision: "Collision",
  damaged_signage: "Damaged signage",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  routine: "Routine",
  urgent: "Urgent",
  critical: "Critical",
};

export const STATUS_LABEL: Record<HazardStatus, string> = {
  detected: "Detected",
  report_ready: "Report ready",
  reported: "Reported",
  in_progress: "In progress",
  resolved: "Resolved",
};
