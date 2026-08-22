from __future__ import annotations

from app.duplicates import lookup_nearby
from app.geocode import reverse_geocode
from app.models import Observation
from app.persist import persist_analysis
from mistral_pipeline.images import prepare_jpeg
from mistral_pipeline.pipeline import analyze_photo


async def analyze_observation(observation: Observation, image_bytes: bytes) -> Observation:
    """Run the Mistral image pipeline and map the result onto an Observation."""
    latitude = observation.coordinates.latitude if observation.coordinates else None
    longitude = observation.coordinates.longitude if observation.coordinates else None
    try:
        result = analyze_photo(
            image_bytes,
            latitude=latitude,
            longitude=longitude,
            reverse_geocode=reverse_geocode,
            lookup_nearby=lookup_nearby,
        )
    except Exception as exc:
        observation.processing_status = "failed"
        observation.description = f"Analysis failed: {exc}"
        return observation

    observation.ocr_text = result.ocr_text or None
    observation.duplicate = result.duplicate
    observation.generated_report = result.generated_report or None
    observation.confidence = result.confidence

    if result.hazard_detected:
        observation.hazard_type = result.hazard_type
        observation.severity = result.severity  # type: ignore[assignment]
        observation.description = result.description
        try:
            jpeg, _ = prepare_jpeg(image_bytes)
            persist_analysis(result, jpeg)
            observation.hazard_id = result.hazard_id
            if result.hazard_id:
                observation.id = result.hazard_id
        except Exception:
            observation.hazard_id = result.hazard_id
    else:
        observation.hazard_type = None
        observation.severity = None
        observation.description = result.description or "No supported road hazard detected."

    if observation.location_source == "unavailable" and observation.ocr_text:
        observation.location_source = "ocr"
        observation.location_confidence = max(observation.location_confidence, 0.35)

    observation.processing_status = "complete"
    return observation
