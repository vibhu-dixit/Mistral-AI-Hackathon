import { MOCK_HAZARDS } from "@/lib/mock/hazards";
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

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
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
  formData.append("image", file);
  if (coords) {
    formData.append("lat", String(coords.lat));
    formData.append("lng", String(coords.lng));
  }
  return apiFetch<AnalyzeResponse>("/analyze-image", {
    method: "POST",
    body: formData,
    headers: undefined, // let the browser set the multipart boundary
  });
}

export async function analyzeVideo(
  file: File,
  coords?: { lat: number; lng: number },
): Promise<AnalyzeResponse> {
  if (USE_MOCK) {
    await delay(1200);
    const sample = MOCK_HAZARDS.slice(0, 4);
    return { hazards: sample, frame_count: 48 };
  }

  const formData = new FormData();
  formData.append("video", file);
  if (coords) {
    formData.append("lat", String(coords.lat));
    formData.append("lng", String(coords.lng));
  }
  return apiFetch<AnalyzeResponse>("/analyze-video", {
    method: "POST",
    body: formData,
    headers: undefined,
  });
}

export async function listHazards(filters?: HazardFilters): Promise<Hazard[]> {
  if (USE_MOCK) {
    await delay(300);
    return MOCK_HAZARDS.filter((hazard) => {
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

  const params = new URLSearchParams();
  filters?.hazard_type?.forEach((v) => params.append("hazard_type", v));
  filters?.severity?.forEach((v) => params.append("severity", v));
  filters?.status?.forEach((v) => params.append("status", v));
  const query = params.toString();
  return apiFetch<Hazard[]>(`/hazards${query ? `?${query}` : ""}`);
}

export async function getHazard(id: string): Promise<Hazard | undefined> {
  if (USE_MOCK) {
    await delay(250);
    return MOCK_HAZARDS.find((hazard) => hazard.id === id);
  }
  return apiFetch<Hazard>(`/hazards/${id}`);
}

export async function submitReport(_id: string): Promise<{ status: HazardStatus }> {
  // Per the brief, real submission is simulated for the hackathon demo —
  // this just flips status client-side rather than calling a real
  // municipal system, even against the "real" backend.
  await delay(400);
  return { status: "reported" };
}
