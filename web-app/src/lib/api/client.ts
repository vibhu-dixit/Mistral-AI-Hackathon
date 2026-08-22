import { MOCK_HAZARDS } from "@/lib/mock/hazards";
import { mapRawHazard } from "@/lib/api/mapHazard";
import type {
  AnalyzeResponse,
  Hazard,
  HazardFilters,
  HazardStatus,
} from "@/lib/types";

/**
 * Every function here checks NEXT_PUBLIC_USE_MOCK_DATA. When true, it
 * returns the skeleton data from lib/mock instead of calling the backend.
 * One flag, flipped in .env.local, switches the whole app between "fully
 * working demo on mock data" and "wired to the real backend" — see
 * PLAN.md §5.3. This is what keeps the frontend demoable even if the
 * AI/Backend integration isn't ready yet.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Request to ${path} failed with status ${res.status}`);
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
  if (USE_MOCK) {
    await delay(600);
    const hazard = MOCK_HAZARDS[Math.floor(Math.random() * MOCK_HAZARDS.length)];
    return { hazards: [hazard] };
  }

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

  if (!raw.hazard_detected) {
    return { hazards: [] };
  }
  return { hazards: [mapRawHazard(raw)] };
}

export async function analyzeVideo(
  _file: File,
  _coords?: { lat: number; lng: number },
): Promise<AnalyzeResponse> {
  if (USE_MOCK) {
    await delay(1200);
    const sample = MOCK_HAZARDS.slice(0, 4);
    return { hazards: sample, frame_count: 48 };
  }

  // The real backend rejects video outright (image-only MVP) — fail fast
  // client-side with a clear message instead of a round trip that 400s.
  throw new Error("Video analysis isn't supported by the backend yet — upload a photo instead.");
}

export async function listHazards(filters?: HazardFilters): Promise<Hazard[]> {
  if (USE_MOCK) {
    await delay(300);
    return applyFilters(MOCK_HAZARDS, filters);
  }

  // The backend's /api/hazards only accepts `limit` — filtering happens
  // client-side here, same as the mock path above.
  const { hazards } = await backendFetch<{ hazards: Record<string, unknown>[] }>("/api/hazards");
  return applyFilters(hazards.map(mapRawHazard), filters);
}

export async function getHazard(id: string): Promise<Hazard | undefined> {
  if (USE_MOCK) {
    await delay(250);
    return MOCK_HAZARDS.find((hazard) => hazard.id === id);
  }

  try {
    const raw = await backendFetch<Record<string, unknown>>(`/api/hazards/${id}`);
    return mapRawHazard(raw);
  } catch {
    return undefined;
  }
}

export async function submitReport(id: string): Promise<{ status: HazardStatus }> {
  if (USE_MOCK) {
    // Per the brief, real submission is simulated for the hackathon demo.
    await delay(400);
    return { status: "reported" };
  }

  // The backend itself simulates the actual SF311 submission — it also
  // refuses (409) critical/collision hazards, which surfaces as a thrown
  // Error here for the caller to display.
  const result = await backendFetch<{ status: string }>(`/api/hazards/${id}/submit`, {
    method: "POST",
  });
  return { status: result.status as HazardStatus };
}
