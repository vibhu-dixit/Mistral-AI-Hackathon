from __future__ import annotations

import httpx

from mistral_pipeline.geo import haversine_m
from mistral_pipeline.routing import SF311_KEYWORDS
from mistral_pipeline.schemas import DuplicateMatch

DATASET = "https://data.sfgov.org/resource/vw6y-z8j6.json"
USER_AGENT = "RoadWatch/1.0 (Mistral AI Hackathon)"


def _matches_category(hazard_type: str, row: dict) -> bool:
    keywords = SF311_KEYWORDS.get(hazard_type, ())
    blob = " ".join(
        str(row.get(key) or "")
        for key in (
            "service_name",
            "service_subtype",
            "service_details",
            "category",
            "status_notes",
            "address",
            "street",
        )
    ).lower()
    return any(keyword in blob for keyword in keywords) if keywords else True


def _fetch(params: dict[str, str]) -> list:
    try:
        with httpx.Client(timeout=12.0, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}) as client:
            response = client.get(DATASET, params=params)
            response.raise_for_status()
            data = response.json()
        return data if isinstance(data, list) else []
    except Exception:
        return []


def search_nearby(hazard_type: str, latitude: float, longitude: float, radius_m: float = 80) -> list[DuplicateMatch]:
    delta = 0.0012  # ~130m
    where = (
        f"lat between {latitude - delta} and {latitude + delta} "
        f"and long between {longitude - delta} and {longitude + delta}"
    )
    params = {
        "$select": "service_request_id,service_name,service_subtype,service_details,status_description,requested_datetime,address,street,agency_responsible,lat,long",
        "$where": where + " and status_description = 'Open'",
        "$order": "requested_datetime DESC",
        "$limit": "25",
    }
    rows = _fetch(params)
    if not rows:
        params["$where"] = where
        rows = _fetch(params)

    matches: list[DuplicateMatch] = []
    if not isinstance(rows, list):
        return matches
    for row in rows:
        try:
            lat = float(row.get("lat"))
            lng = float(row.get("long"))
        except (TypeError, ValueError):
            continue
        distance = haversine_m(latitude, longitude, lat, lng)
        if distance > radius_m:
            continue
        if not _matches_category(hazard_type, row):
            continue
        service = str(row.get("service_name") or "SF311")
        details = str(row.get("service_details") or row.get("service_subtype") or "")
        address = str(row.get("address") or "")
        agency = str(row.get("agency_responsible") or "")
        summary = service
        if details:
            summary = f"{service} / {details}"
        if address:
            summary = f"{summary} at {address}"
        if agency:
            summary = f"{summary} ({agency})"
        matches.append(
            DuplicateMatch(
                source="sf311",
                id=str(row.get("service_request_id") or address or "unknown"),
                category=service,
                distance_meters=round(distance, 1),
                status=str(row.get("status_description") or ""),
                summary=summary,
                latitude=lat,
                longitude=lng,
            )
        )
    matches.sort(key=lambda item: item.distance_meters)
    return matches[:8]
