from __future__ import annotations

from typing import Any

import httpx

from mistral_pipeline.geo import normalize_sf_street_name

NOMINATIM = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "RoadWatch/1.0 (Mistral AI Hackathon)"


def reverse_geocode(latitude: float, longitude: float) -> dict[str, Any] | None:
    """Reverse-geocode GPS to a map label plus the SF permit street name."""
    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "jsonv2",
        "zoom": 17,
    }
    with httpx.Client(timeout=12.0, headers={"User-Agent": USER_AGENT}) as client:
        response = client.get(NOMINATIM, params=params)
        response.raise_for_status()
        data = response.json()
    address = data.get("address") or {}
    road = address.get("road") or address.get("pedestrian") or address.get("neighbourhood")
    neighborhood = address.get("suburb") or address.get("neighbourhood") or address.get("city")
    house = address.get("house_number")
    if road and house:
        label = f"{house} {road}"
    elif road:
        label = road
    else:
        label = data.get("display_name")
    if label and neighborhood and neighborhood not in str(label):
        label = f"{label}, {neighborhood}"
    if not label and not road:
        return None
    return {
        "label": label,
        "road": road,
        "road_normalized": normalize_sf_street_name(road) if road else None,
        "neighborhood": neighborhood,
    }
