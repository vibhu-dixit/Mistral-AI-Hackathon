import type { Hazard, HazardStatus, HazardType, Severity } from "@/lib/types";

/**
 * Two real backend shapes need to become our `Hazard`: the flat
 * `HazardAnalysis` pydantic model returned by `POST /analyze-image`
 * (field `hazard_id`, both `target_category` and `civic_category`), and a
 * raw `hazards` table row from `GET /api/hazards` (field `id`, only
 * `civic_category`, `is_duplicate` instead of `duplicate`). This mapper
 * covers both with fallbacks rather than needing two separate mappers.
 */
export function mapRawHazard(raw: Record<string, unknown>): Hazard {
  const duplicateMatch = raw.duplicate_match as { distance_meters?: number } | null | undefined;

  return {
    id: (raw.id as string) ?? (raw.hazard_id as string) ?? crypto.randomUUID(),
    hazard_type: (raw.hazard_type as HazardType) ?? "pothole",
    severity: (raw.severity as Severity) ?? "routine",
    confidence: Number(raw.confidence ?? 0),
    latitude: Number(raw.latitude ?? 0),
    longitude: Number(raw.longitude ?? 0),
    location_label: (raw.location_label as string) ?? "",
    description: (raw.description as string) ?? "",
    ai_reasoning: (raw.ai_reasoning as string) ?? "",
    image_url: (raw.image_url as string | null) ?? null,
    priority_score: Number(raw.priority_score ?? 0),
    duplicate: Boolean(raw.duplicate ?? raw.is_duplicate ?? false),
    duplicate_distance_m: duplicateMatch?.distance_meters,
    target_category: (raw.target_category as string) ?? (raw.civic_category as string) ?? "",
    generated_report: (raw.generated_report as string) ?? "",
    status: (raw.status as HazardStatus) ?? "detected",
    detected_at: (raw.created_at as string) ?? new Date().toISOString(),
    // The backend doesn't track citizen votes yet — real hazards start at 0.
    votes: Number(raw.votes ?? 0),
  };
}
