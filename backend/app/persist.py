from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app import hazard_memory
from app.present import present_analysis, to_db_hazard_type
from app.store import get_supabase
from mistral_pipeline.schemas import HazardAnalysis


DEFAULT_MAP_LAT = 37.7749
DEFAULT_MAP_LNG = -122.4194


def persist_analysis(analysis: HazardAnalysis, image_bytes: bytes, force_new: bool = False) -> HazardAnalysis:
    if not analysis.hazard_detected:
        return analysis

    now = datetime.now(timezone.utc).isoformat()
    existing_id = None
    if (
        not force_new
        and analysis.duplicate
        and analysis.duplicate_match
        and analysis.duplicate_match.source == "roadwatch"
        and analysis.duplicate_match.id
    ):
        existing_id = analysis.duplicate_match.id

    hazard_id = existing_id or analysis.hazard_id or str(uuid.uuid4())
    analysis.hazard_id = hazard_id

    if analysis.latitude is None or analysis.longitude is None:
        analysis.latitude = DEFAULT_MAP_LAT
        analysis.longitude = DEFAULT_MAP_LNG
        if not analysis.location_label:
            analysis.location_label = "Location approximate — enable GPS on the next upload for a precise pin"
        if analysis.location_confidence in {"", "none"}:
            analysis.location_confidence = "low"

    image_url = analysis.image_url
    try:
        client = get_supabase()
        path = f"hazards/{hazard_id}/{uuid.uuid4().hex}.jpg"
        try:
            client.storage.from_("hazard-media").upload(
                path,
                image_bytes,
                {"content-type": "image/jpeg", "upsert": "true"},
            )
            image_url = client.storage.from_("hazard-media").get_public_url(path)
        except Exception as exc:
            analysis.persist_error = f"image upload failed: {exc}"

        db_type = to_db_hazard_type(analysis.hazard_type)
        if existing_id:
            client.table("observations").insert(
                {
                    "hazard_id": existing_id,
                    "observed_at": now,
                    "latitude": analysis.latitude,
                    "longitude": analysis.longitude,
                    "image_url": image_url,
                    "source": "photo",
                }
            ).execute()
            current = (
                client.table("hazards")
                .select("sighting_count,status")
                .eq("id", existing_id)
                .limit(1)
                .execute()
            )
            rows = current.data or []
            sightings = int((rows[0].get("sighting_count") if rows else 1) or 1) + 1
            updates = {"sighting_count": sightings, "updated_at": now}
            if image_url:
                updates["image_url"] = image_url
            client.table("hazards").update(updates).eq("id", existing_id).execute()
            analysis.linked_to_existing = True
            if rows:
                analysis.status = str(rows[0].get("status") or analysis.status)
        else:
            payload = {
                "id": hazard_id,
                "hazard_type": db_type,
                "severity": analysis.severity or "routine",
                "status": analysis.status,
                "confidence": analysis.confidence,
                "latitude": analysis.latitude,
                "longitude": analysis.longitude,
                "location_label": analysis.location_label,
                "location_confidence": analysis.location_confidence,
                "ocr_text": analysis.ocr_text[:4000] if analysis.ocr_text else None,
                "description": analysis.description,
                "ai_reasoning": analysis.ai_reasoning,
                "lane_impact": analysis.lane_impact,
                "image_url": image_url,
                "priority_score": analysis.priority_score,
                "is_duplicate": analysis.duplicate,
                "duplicate_of": None,
                "civic_category": analysis.civic_category,
                "target_agency": analysis.target_agency,
                "generated_report": analysis.generated_report,
                "created_at": now,
                "updated_at": now,
            }
            client.table("hazards").insert(payload).execute()
            client.table("observations").insert(
                {
                    "hazard_id": hazard_id,
                    "observed_at": now,
                    "latitude": analysis.latitude,
                    "longitude": analysis.longitude,
                    "image_url": image_url,
                    "source": "photo",
                }
            ).execute()
            if analysis.generated_report:
                client.table("reports").insert(
                    {
                        "hazard_id": hazard_id,
                        "civic_category": analysis.civic_category or analysis.target_category,
                        "generated_text": analysis.generated_report,
                        "target_agency": analysis.target_agency,
                        "status": "ready_for_submission",
                    }
                ).execute()
        analysis.image_url = image_url
        analysis.persisted = True
    except Exception as exc:
        analysis.persisted = False
        analysis.persist_error = str(exc)
        if image_url:
            analysis.image_url = image_url

    hazard_memory.remember(present_analysis(analysis, detected_at=now))
    return analysis
