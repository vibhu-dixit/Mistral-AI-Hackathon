from __future__ import annotations

from mistral_pipeline.client import get_client, vision_model
from mistral_pipeline.jsonutil import parse_json_object
from mistral_pipeline.prompts import VISION_SYSTEM, VISION_USER
from mistral_pipeline.schemas import VisionResult
from mistral_pipeline.structured import VISION_JSON_SCHEMA, json_schema_format

ALLOWED_TYPES = {
    "pothole",
    "road_debris",
    "blocked_lane",
    "flooding",
    "collision",
    "damaged_signage",
    "none",
}


def analyze_image(data_uri: str) -> VisionResult:
    client = get_client()
    model = vision_model()
    messages = [
        {"role": "system", "content": VISION_SYSTEM},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": VISION_USER},
                {"type": "image_url", "image_url": {"url": data_uri}},
            ],
        },
    ]
    formats = (
        json_schema_format("hazard_vision", VISION_JSON_SCHEMA),
        {"type": "json_object"},
    )
    last_error: Exception | None = None
    data: dict | None = None
    for response_format in formats:
        try:
            response = client.chat.complete(
                model=model,
                messages=messages,
                response_format=response_format,
                temperature=0.1,
            )
            raw = response.choices[0].message.content or ""
            data = parse_json_object(raw)
            last_error = None
            break
        except Exception as exc:
            last_error = exc
    if data is None:
        raise last_error or RuntimeError("vision returned no JSON")
    hazard_type = str(data.get("hazard_type") or "none").strip().lower()
    if hazard_type == "debris":
        hazard_type = "road_debris"
    if hazard_type not in ALLOWED_TYPES:
        hazard_type = "none"
    detected = bool(data.get("hazard_detected"))
    if hazard_type != "none":
        detected = True
    if not detected:
        hazard_type = "none"
    severity = data.get("severity")
    if severity not in {"routine", "urgent", "critical"}:
        severity = None if not detected else "routine"
    confidence = float(data.get("confidence") or 0)
    confidence = max(0.0, min(1.0, confidence))
    lane_impact = data.get("lane_impact") if data.get("lane_impact") in {"none", "partial", "full"} else "none"
    visible = data.get("visible_text") or []
    if not isinstance(visible, list):
        visible = [str(visible)]
    return VisionResult(
        hazard_detected=detected,
        hazard_type=hazard_type,  # type: ignore[arg-type]
        confidence=confidence,
        severity=None if not detected else severity,  # type: ignore[arg-type]
        lane_impact=lane_impact,  # type: ignore[arg-type]
        road_impact=str(data.get("road_impact") or ""),
        description=str(data.get("description") or ""),
        ai_reasoning=str(data.get("ai_reasoning") or ""),
        visible_text=[str(item) for item in visible if str(item).strip()],
    )
