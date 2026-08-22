from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from mistral_pipeline.schemas import HazardAnalysis

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
        "image_url": analysis.image_url,
        "priority_score": analysis.priority_score,
        "duplicate": analysis.duplicate,
        "duplicate_distance_m": distance,
        "target_category": analysis.target_category or analysis.civic_category or "",
        "generated_report": analysis.generated_report or "",
        "status": analysis.status or "detected",
        "detected_at": when,
        "votes": 0,
        "agent": analysis.agent,
        "agent_phone": analysis.agent_phone,
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
        "image_url": row.get("image_url"),
        "priority_score": int(row.get("priority_score") or 0),
        "duplicate": bool(row.get("duplicate", row.get("is_duplicate") or False)),
        "duplicate_distance_m": row.get("duplicate_distance_m"),
        "target_category": row.get("target_category") or row.get("civic_category") or "",
        "generated_report": row.get("generated_report") or "",
        "status": row.get("status") or "detected",
        "detected_at": row.get("detected_at") or row.get("created_at") or datetime.now(timezone.utc).isoformat(),
        "votes": int(row.get("votes") or 0),
        "agent": row.get("agent"),
        "agent_phone": row.get("agent_phone") or row.get("agentphone"),
    }
