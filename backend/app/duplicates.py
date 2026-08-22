from __future__ import annotations

from app import sf311
from app.store import search_hazards
from mistral_pipeline.schemas import DuplicateMatch


def lookup_nearby(hazard_type: str, latitude: float, longitude: float) -> list[DuplicateMatch]:
    roadwatch = search_hazards(hazard_type, latitude, longitude)
    civic = sf311.search_nearby(hazard_type, latitude, longitude)
    combined = [*roadwatch, *civic]
    combined.sort(key=lambda item: item.distance_meters)
    return combined[:10]
