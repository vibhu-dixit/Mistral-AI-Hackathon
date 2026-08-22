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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8010";

function asOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function resolveImageUrl(raw: Record<string, unknown>): string | null {
  const stored = raw.image_url;
  if (!stored || typeof stored !== "string") return null;
  const id = (raw.id as string) ?? (raw.hazard_id as string);
  if (id) {
    return `${API_BASE_URL}/api/hazards/${encodeURIComponent(id)}/image`;
  }
  if (stored.startsWith("/")) {
    return `${API_BASE_URL}${stored}`;
  }
  return stored;
}

function asBlank(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
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
    image_url: resolveImageUrl(raw),
    priority_score: Number(raw.priority_score ?? 0),
    duplicate: Boolean(raw.duplicate ?? raw.is_duplicate ?? false),
    duplicate_distance_m:
      asOptionalNumber(raw.duplicate_distance_m) ?? duplicateMatch?.distance_meters,
    target_category: (raw.target_category as string) ?? (raw.civic_category as string) ?? "",
    generated_report: (raw.generated_report as string) ?? "",
    status: mapStatus(raw.status),
    detected_at: (raw.detected_at as string) ?? (raw.created_at as string) ?? new Date().toISOString(),
    votes: Number(raw.votes ?? 0),
    agent: asBlank(raw.agent),
    agent_phone: asBlank(raw.agent_phone ?? raw.agentphone),
    permit_street_name: asBlank(raw.permit_street_name ?? raw.street_name),
    permit_number: asBlank(raw.permit_number),
    permit_type: asBlank(raw.permit_type),
    permit_status: asBlank(raw.permit_status),
    permit_distance_m: asOptionalNumber(raw.permit_distance_m),
  };
}
