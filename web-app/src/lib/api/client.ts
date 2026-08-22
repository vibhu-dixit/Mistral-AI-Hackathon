import { mapRawHazard } from "@/lib/api/mapHazard";
import type {
  AnalyzeResponse,
  Hazard,
  HazardFilters,
  HazardStatus,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8010";

async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(" ")
          : `Request to ${path} failed with status ${res.status}`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

function applyFilters(hazards: Hazard[], filters?: HazardFilters): Hazard[] {
  return hazards.filter((hazard) => {
    if (filters?.hazard_type?.length && !filters.hazard_type.includes(hazard.hazard_type)) {
      return false;
    }
    if (filters?.severity?.length && !filters.severity.includes(hazard.severity)) {
      return false;
    }
    if (filters?.status?.length && !filters.status.includes(hazard.status)) {
      return false;
    }
    return true;
  });
}

export async function analyzeImage(
  file: File,
  coords?: { lat: number; lng: number },
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (coords) {
    formData.append("latitude", String(coords.lat));
    formData.append("longitude", String(coords.lng));
  }
  const raw = await backendFetch<Record<string, unknown>>("/analyze-image", {
    method: "POST",
    body: formData,
  });

  console.log("[RoadWatch] /analyze-image raw pipeline result:", raw);

  if (!raw.hazard_detected) {
    return {
      hazards: [],
      ai_reasoning: typeof raw.ai_reasoning === "string" ? raw.ai_reasoning : "",
    };
  }
  return { hazards: [mapRawHazard(raw)], persist_error: typeof raw.persist_error === "string" ? raw.persist_error : undefined };
}

export async function analyzeVideo(
  _file?: File,
  _coords?: { lat: number; lng: number },
): Promise<AnalyzeResponse> {
  throw new Error("Video analysis isn't supported yet — upload a photo instead.");
}

export async function listHazards(filters?: HazardFilters): Promise<Hazard[]> {
  const { hazards } = await backendFetch<{ hazards: Record<string, unknown>[] }>("/api/hazards");
  return applyFilters(hazards.map(mapRawHazard), filters);
}

export async function getHazard(id: string): Promise<Hazard | undefined> {
  const res = await fetch(`${API_BASE_URL}/api/hazards/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(typeof body?.detail === "string" ? body.detail : `Request failed with status ${res.status}`);
  }
  return mapRawHazard((await res.json()) as Record<string, unknown>);
}

export async function submitReport(id: string): Promise<{ status: HazardStatus }> {
  const result = await backendFetch<{ status: string }>(`/api/hazards/${id}/submit`, {
    method: "POST",
  });
  return { status: result.status as HazardStatus };
}
