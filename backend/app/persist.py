from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.store import get_supabase
from mistral_pipeline.schemas import HazardAnalysis


def persist_analysis(analysis: HazardAnalysis, image_bytes: bytes, force_new: bool = False) -> HazardAnalysis:
    if not analysis.hazard_detected:
        return analysis
    if analysis.latitude is None or analysis.longitude is None:
        analysis.persist_error = "Missing coordinates; analysis returned but not stored"
        return analysis

    client = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    image_url = None

    existing_id = None
    if (
        not force_new
        and analysis.duplicate
        and analysis.duplicate_match
        and analysis.duplicate_match.source == "roadwatch"
        and analysis.duplicate_match.id
    ):
        existing_id = analysis.duplicate_match.id

    hazard_id = existing_id or str(uuid.uuid4())
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
        analysis.hazard_id = existing_id
        analysis.image_url = image_url
        analysis.linked_to_existing = True
        analysis.persisted = True
        if rows:
            analysis.status = str(rows[0].get("status") or analysis.status)
        return analysis

    payload = {
        "id": hazard_id,
        "hazard_type": analysis.hazard_type,
        "severity": analysis.severity,
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

    analysis.hazard_id = hazard_id
    analysis.image_url = image_url
    analysis.persisted = True
    return analysis
