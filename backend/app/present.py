from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from mistral_pipeline.schemas import HazardAnalysis, StreetPermitMatch

TO_UI_TYPE = {
    "road_debris": "debris",
    "debris": "debris",
}

TO_DB_TYPE = {
    "debris": "road_debris",
    "road_debris": "road_debris",
}


def to_ui_hazard_type(value: str | None) -> str:
    if not value or value == "none":
        return "pothole"
    return TO_UI_TYPE.get(value, value)


def to_db_hazard_type(value: str | None) -> str:
    if not value or value == "none":
        return "pothole"
    return TO_DB_TYPE.get(value, value)


def ui_image_url(hazard_id: str | None, stored_url: str | None) -> str | None:
    """Browser never loads Supabase storage directly — photos go through the API."""
    if not stored_url:
        return None
    if not hazard_id:
        return stored_url
    return f"/api/hazards/{hazard_id}/image"


def _blank(value: object) -> str:
    if value is None:
        return ""
    return str(value).strip()


def permit_fields_from_match(match: StreetPermitMatch | None) -> dict[str, Any]:
    if match is None:
        return {
            "agent": "",
            "agent_phone": "",
            "permit_street_name": "",
            "permit_number": "",
            "permit_type": "",
            "permit_status": "",
            "permit_distance_m": None,
        }
    return {
        "agent": _blank(match.agent),
        "agent_phone": _blank(match.agent_phone),
        "permit_street_name": _blank(match.street_name),
        "permit_number": _blank(match.permit_number),
        "permit_type": _blank(match.permit_type),
        "permit_status": _blank(match.status),
        "permit_distance_m": match.distance_meters,
    }


def permit_fields_from_analysis(analysis: HazardAnalysis) -> dict[str, Any]:
    fields = permit_fields_from_match(analysis.street_permit)
    if analysis.agent:
        fields["agent"] = _blank(analysis.agent)
    if analysis.agent_phone:
        fields["agent_phone"] = _blank(analysis.agent_phone)
    return fields


def permit_fields_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "agent": _blank(row.get("agent")),
        "agent_phone": _blank(row.get("agent_phone") or row.get("agentphone")),
        "permit_street_name": _blank(row.get("permit_street_name") or row.get("street_name")),
        "permit_number": _blank(row.get("permit_number")),
        "permit_type": _blank(row.get("permit_type")),
        "permit_status": _blank(row.get("permit_status") or row.get("permitstatus")),
        "permit_distance_m": row.get("permit_distance_m"),
    }

def present_analysis(analysis: HazardAnalysis, *, detected_at: str | None = None) -> dict[str, Any]:
    when = detected_at or datetime.now(timezone.utc).isoformat()
    distance = None
    if analysis.duplicate_match is not None:
        distance = analysis.duplicate_match.distance_meters
    return {
        "id": analysis.hazard_id or "",
        "hazard_type": to_ui_hazard_type(analysis.hazard_type),
        "severity": analysis.severity or "routine",
        "confidence": analysis.confidence,
        "latitude": analysis.latitude or 0,
        "longitude": analysis.longitude or 0,
        "location_label": analysis.location_label or "",
        "description": analysis.description or "",
        "ai_reasoning": analysis.ai_reasoning or "",
        "image_url": ui_image_url(analysis.hazard_id, analysis.image_url),
        "priority_score": analysis.priority_score,
        "duplicate": analysis.duplicate,
        "duplicate_distance_m": distance,
        "target_category": analysis.target_category or analysis.civic_category or "",
        "generated_report": analysis.generated_report or "",
        "status": analysis.status or "detected",
        "detected_at": when,
        "votes": 0,
        "persisted": analysis.persisted,
        "persist_error": analysis.persist_error,
        **permit_fields_from_analysis(analysis),
    }


def present_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row.get("id") or ""),
        "hazard_type": to_ui_hazard_type(str(row.get("hazard_type") or "")),
        "severity": row.get("severity") or "routine",
        "confidence": float(row.get("confidence") or 0),
        "latitude": float(row.get("latitude") or 0),
        "longitude": float(row.get("longitude") or 0),
        "location_label": row.get("location_label") or "",
        "description": row.get("description") or "",
        "ai_reasoning": row.get("ai_reasoning") or "",
        "image_url": ui_image_url(str(row.get("id") or ""), row.get("image_url")),
        "priority_score": int(row.get("priority_score") or 0),
        "duplicate": bool(row.get("duplicate", row.get("is_duplicate") or False)),
        "duplicate_distance_m": row.get("duplicate_distance_m"),
        "target_category": row.get("target_category") or row.get("civic_category") or "",
        "generated_report": row.get("generated_report") or "",
        "status": row.get("status") or "detected",
        "detected_at": row.get("detected_at") or row.get("created_at") or datetime.now(timezone.utc).isoformat(),
        "votes": int(row.get("votes") or 0),
        "persisted": True,
        **permit_fields_from_row(row),
    }
