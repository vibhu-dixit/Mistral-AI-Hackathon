from __future__ import annotations

from datetime import datetime, timezone

import httpx

from mistral_pipeline.geo import haversine_m, normalize_sf_street_name, street_names_match
from mistral_pipeline.schemas import StreetPermitMatch

# https://data.sfgov.org/City-Infrastructure/Active-Street-Use-Permits/x8nh-xzn6
DATASET = "https://data.sfgov.org/resource/x8nh-xzn6.json"
USER_AGENT = "RoadWatch/1.0 (Mistral AI Hackathon)"
SELECT = (
    "permit_number,streetname,cross_street_1,cross_street_2,permit_type,"
    "agent,agentphone,permit_purpose,status,permit_start_date,permit_end_date,"
    "permit_address,latitude,longitude"
)
SPATIAL_RADIUS_M = 250
NAME_SEARCH_LIMIT = 50


def _fetch(params: dict[str, str]) -> list:
    try:
        with httpx.Client(timeout=12.0, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}) as client:
            response = client.get(DATASET, params=params)
            response.raise_for_status()
            data = response.json()
        return data if isinstance(data, list) else []
    except Exception:
        return []


def _parse_date(value: object) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed


def _is_current(row: dict, now: datetime) -> bool:
    start = _parse_date(row.get("permit_start_date"))
    end = _parse_date(row.get("permit_end_date"))
    if start and now < start:
        return False
    if end and now > end:
        return False
    return True


def _row_coords(row: dict) -> tuple[float, float] | None:
    try:
        return float(row["latitude"]), float(row["longitude"])
    except (KeyError, TypeError, ValueError):
        return None


def _to_match(
    row: dict,
    latitude: float,
    longitude: float,
    street_match: bool,
) -> StreetPermitMatch | None:
    agent = str(row.get("agent") or "").strip() or None
    phone = str(row.get("agentphone") or "").strip() or None
    if not agent and not phone:
        return None
    coords = _row_coords(row)
    distance = round(haversine_m(latitude, longitude, *coords), 1) if coords else None
    return StreetPermitMatch(
        agent=agent,
        agent_phone=phone,
        street_name=str(row.get("streetname") or "").strip() or None,
        permit_number=str(row.get("permit_number") or "").strip() or None,
        permit_type=str(row.get("permit_type") or "").strip() or None,
        status=str(row.get("status") or "").strip() or None,
        distance_meters=distance,
        street_match=street_match,
    )


def _score(match: StreetPermitMatch, row: dict, now: datetime) -> tuple:
    street_rank = 0 if match.street_match else 1
    current_rank = 0 if _is_current(row, now) else 1
    status = (match.status or "").upper()
    status_rank = 0 if status == "ACTIVE" else 1 if status == "APPROVED" else 2
    distance = match.distance_meters if match.distance_meters is not None else 1e9
    return (street_rank, current_rank, status_rank, distance)


def _fetch_spatial(latitude: float, longitude: float, radius_m: float) -> list:
    return _fetch(
        {
            "$select": SELECT,
            "$where": f"within_circle(location, {latitude}, {longitude}, {int(radius_m)})",
            "$limit": "50",
        }
    )


def _fetch_by_street(street_name: str) -> list:
    escaped = street_name.replace("'", "''")
    rows = _fetch(
        {
            "$select": SELECT,
            "$where": f"upper(streetname) = '{escaped}'",
            "$limit": str(NAME_SEARCH_LIMIT),
        }
    )
    if rows:
        return rows
    stem = street_name.rsplit(" ", 1)[0] if " " in street_name else street_name
    if stem == street_name:
        return rows
    escaped_stem = stem.replace("'", "''")
    return _fetch(
        {
            "$select": SELECT,
            "$where": f"upper(streetname) like '{escaped_stem} %'",
            "$limit": str(NAME_SEARCH_LIMIT),
        }
    )


def lookup_street_permit(
    latitude: float,
    longitude: float,
    street_name: str | None = None,
    radius_m: float = SPATIAL_RADIUS_M,
) -> StreetPermitMatch | None:
    """Find the contractor (agent + phone) for the road at this GPS point.

    Prefers permits whose `streetname` matches the reverse-geocoded road, then
    the spatially closest active/approved permit. Falls back to a citywide
    street-name query when nothing nearby matches the road.
    """
    now = datetime.now(timezone.utc)
    normalized = normalize_sf_street_name(street_name)
    rows: list = []
    seen: set[tuple] = set()

    def add_rows(batch: list) -> None:
        for row in batch:
            key = (
                row.get("permit_number"),
                row.get("streetname"),
                row.get("latitude"),
                row.get("longitude"),
            )
            if key in seen:
                continue
            seen.add(key)
            rows.append(row)

    add_rows(_fetch_spatial(latitude, longitude, radius_m))
    if normalized and not any(street_names_match(normalized, row.get("streetname")) for row in rows):
        add_rows(_fetch_by_street(normalized))

    scored: list[tuple[tuple, StreetPermitMatch]] = []
    for row in rows:
        street_match = bool(normalized) and street_names_match(normalized, row.get("streetname"))
        match = _to_match(row, latitude, longitude, street_match)
        if match is None:
            continue
        if (
            match.distance_meters is not None
            and match.distance_meters > radius_m
            and not street_match
        ):
            continue
        scored.append((_score(match, row, now), match))

    if not scored:
        return None
    scored.sort(key=lambda item: item[0])
    return scored[0][1]
