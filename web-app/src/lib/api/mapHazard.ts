import type { Hazard, HazardStatus, HazardType, Severity } from "@/lib/types";

const HAZARD_TYPES: HazardType[] = [
  "pothole",
  "debris",
  "blocked_lane",
  "flooding",
  "collision",
  "damaged_signage",
];

const SEVERITIES: Severity[] = ["routine", "urgent", "critical"];

const STATUSES: HazardStatus[] = [
  "detected",
  "report_ready",
  "reported",
  "in_progress",
  "resolved",
];

function mapHazardType(value: unknown): HazardType {
  if (value === "road_debris") return "debris";
  if (typeof value === "string" && (HAZARD_TYPES as string[]).includes(value)) {
    return value as HazardType;
  }
  return "pothole";
}

function mapSeverity(value: unknown): Severity {
  if (typeof value === "string" && (SEVERITIES as string[]).includes(value)) {
    return value as Severity;
  }
  return "routine";
}

function mapStatus(value: unknown): HazardStatus {
  if (typeof value === "string" && (STATUSES as string[]).includes(value)) {
    return value as HazardStatus;
  }
  return "detected";
}

export function mapRawHazard(raw: Record<string, unknown>): Hazard {
  const duplicateMatch = raw.duplicate_match as { distance_meters?: number } | null | undefined;

  return {
    id: (raw.id as string) ?? (raw.hazard_id as string) ?? crypto.randomUUID(),
    hazard_type: mapHazardType(raw.hazard_type),
    severity: mapSeverity(raw.severity),
    confidence: Number(raw.confidence ?? 0),
    latitude: Number(raw.latitude ?? 0),
    longitude: Number(raw.longitude ?? 0),
    location_label: (raw.location_label as string) ?? "",
    description: (raw.description as string) ?? "",
    ai_reasoning: (raw.ai_reasoning as string) ?? "",
    image_url: (raw.image_url as string | null) ?? null,
    priority_score: Number(raw.priority_score ?? 0),
    duplicate: Boolean(raw.duplicate ?? raw.is_duplicate ?? false),
    duplicate_distance_m:
      typeof raw.duplicate_distance_m === "number"
        ? raw.duplicate_distance_m
        : duplicateMatch?.distance_meters,
    target_category: (raw.target_category as string) ?? (raw.civic_category as string) ?? "",
    generated_report: (raw.generated_report as string) ?? "",
    status: mapStatus(raw.status),
    detected_at: (raw.detected_at as string) ?? (raw.created_at as string) ?? new Date().toISOString(),
    votes: Number(raw.votes ?? 0),
  };
}
