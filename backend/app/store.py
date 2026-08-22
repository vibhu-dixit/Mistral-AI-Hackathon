from __future__ import annotations

from supabase import Client, create_client

from app.config import supabase_key, supabase_url
from mistral_pipeline.geo import haversine_m
from mistral_pipeline.schemas import DuplicateMatch

_client: Client | None = None


def get_supabase() -> Client:
    global _client
    url = supabase_url()
    key = supabase_key()
    if not url or not key:
        raise RuntimeError("Supabase URL or key is not configured")
    if _client is None:
        _client = create_client(url, key)
    return _client


def search_hazards(hazard_type: str, latitude: float, longitude: float, radius_m: float = 50) -> list[DuplicateMatch]:
    delta = 0.0009
    try:
        client = get_supabase()
        result = (
            client.table("hazards")
            .select("id,hazard_type,status,description,latitude,longitude,location_label")
            .eq("hazard_type", hazard_type)
            .neq("status", "resolved")
            .gte("latitude", latitude - delta)
            .lte("latitude", latitude + delta)
            .gte("longitude", longitude - delta)
            .lte("longitude", longitude + delta)
            .limit(25)
            .execute()
        )
        rows = result.data or []
    except Exception:
        return []

    matches: list[DuplicateMatch] = []
    for row in rows:
        try:
            lat = float(row["latitude"])
            lng = float(row["longitude"])
        except (KeyError, TypeError, ValueError):
            continue
        distance = haversine_m(latitude, longitude, lat, lng)
        if distance > radius_m:
            continue
        label = row.get("location_label") or row.get("description") or "Existing RoadWatch hazard"
        matches.append(
            DuplicateMatch(
                source="roadwatch",
                id=str(row.get("id")),
                hazard_type=str(row.get("hazard_type") or hazard_type),
                distance_meters=round(distance, 1),
                status=str(row.get("status") or ""),
                summary=f"{label} ({round(distance)} m away)",
                latitude=lat,
                longitude=lng,
            )
        )
    matches.sort(key=lambda item: item.distance_meters)
    return matches
