from __future__ import annotations

import os
import time
from collections.abc import Callable
from typing import Any

from mistral_pipeline import agent as agent_mod
from mistral_pipeline import ocr as ocr_mod
from mistral_pipeline import vision as vision_mod
from mistral_pipeline.client import agent_model, ocr_model, vision_model
from mistral_pipeline.geo import extract_exif_gps
from mistral_pipeline.images import prepare_jpeg
from mistral_pipeline.routing import base_priority, default_routing
from mistral_pipeline.schemas import (
    AgentResult,
    DuplicateMatch,
    HazardAnalysis,
    OcrResult,
    PipelineStep,
    StreetPermitMatch,
    VisionResult,
)


def team_contract(analysis: HazardAnalysis) -> dict[str, Any]:
    return {
        "hazard_type": analysis.hazard_type,
        "severity": analysis.severity,
        "confidence": analysis.confidence,
        "latitude": analysis.latitude,
        "longitude": analysis.longitude,
        "description": analysis.description,
        "priority_score": analysis.priority_score,
        "duplicate": analysis.duplicate,
        "target_category": analysis.target_category,
        "generated_report": analysis.generated_report,
        "agent": analysis.agent,
        "agent_phone": analysis.agent_phone,
    }


def build_agent_loop(
    *,
    vision: VisionResult | None,
    ocr: OcrResult | None,
    agent: AgentResult | None,
    latitude: float | None,
    longitude: float | None,
    geocode_label: str | None,
    nearby: list[DuplicateMatch],
    duplicate: bool,
    routing: dict[str, str],
    status: str,
    street_permit: StreetPermitMatch | None = None,
) -> dict[str, Any]:
    return {
        "see": {
            "question": "What happened?",
            "hazard_type": None if vision is None else vision.hazard_type,
            "confidence": None if vision is None else vision.confidence,
            "detected": False if vision is None else vision.hazard_detected,
        },
        "understand": {
            "question": "How serious is it?",
            "severity": None if vision is None else vision.severity,
            "lane_impact": None if vision is None else vision.lane_impact,
            "ai_reasoning": None if vision is None else vision.ai_reasoning,
            "description": None if vision is None else vision.description,
        },
        "locate": {
            "question": "Where is it?",
            "latitude": latitude,
            "longitude": longitude,
            "geocode": geocode_label,
            "ocr_text": None if ocr is None else ocr.text,
            "location_label": None if agent is None else agent.location_label,
            "location_confidence": None if agent is None else agent.location_confidence,
            "street_name": None if street_permit is None else street_permit.street_name,
            "agent": None if street_permit is None else street_permit.agent,
            "agent_phone": None if street_permit is None else street_permit.agent_phone,
        },
        "check": {
            "question": "Has it already been reported?",
            "duplicate": duplicate,
            "nearby_count": len(nearby),
            "nearby_reports": [item.model_dump() for item in nearby[:5]],
        },
        "prioritize": {
            "question": "How should this be ranked?",
            "priority_score": None if agent is None else agent.priority_score,
            "human_review_required": False if agent is None else agent.human_review_required,
        },
        "route": {
            "question": "How should it be categorized?",
            "civic_category": (agent.civic_category if agent else routing.get("civic_category")),
            "target_agency": (agent.target_agency if agent else routing.get("target_agency")),
        },
        "act": {
            "question": "What information should be included?",
            "generated_report": None if agent is None else agent.generated_report,
            "status": status,
        },
    }


def _timed(name: str, model: str | None, fn: Callable[[], Any]) -> tuple[Any, PipelineStep]:
    started = time.perf_counter()
    try:
        value = fn()
        ms = int((time.perf_counter() - started) * 1000)
        if hasattr(value, "model_dump"):
            detail = value.model_dump()
        elif isinstance(value, list):
            detail = {"count": len(value)}
        elif value is None:
            detail = {}
        else:
            detail = {"value": value}
        return value, PipelineStep(name=name, model=model, ms=ms, ok=True, detail=detail)
    except Exception as exc:
        ms = int((time.perf_counter() - started) * 1000)
        return None, PipelineStep(
            name=name,
            model=model,
            ms=ms,
            ok=False,
            detail={"error": str(exc)},
        )


def _empty_analysis(steps: list[PipelineStep], **kwargs: Any) -> HazardAnalysis:
    return HazardAnalysis(
        hazard_type="none",
        severity=None,
        confidence=0,
        latitude=None,
        longitude=None,
        description="",
        priority_score=0,
        duplicate=False,
        target_category="",
        generated_report="",
        pipeline=steps,
        **kwargs,
    )


NearbyLookup = Callable[[str, float, float], list[DuplicateMatch]]
ReverseGeocode = Callable[[float, float], Any]
PermitLookup = Callable[..., StreetPermitMatch | None]


def _geocode_parts(value: Any) -> tuple[str | None, str | None]:
    if isinstance(value, dict):
        label = value.get("label") or value.get("display_name")
        label = str(label).strip() if label else None
        road = value.get("road_normalized") or value.get("road") or label
        road = str(road).strip() if road else None
        return label, road
    if isinstance(value, str) and value.strip():
        return value.strip(), value.strip()
    return None, None


def analyze_photo(
    image_bytes: bytes,
    latitude: float | None = None,
    longitude: float | None = None,
    *,
    reverse_geocode: ReverseGeocode | None = None,
    lookup_nearby: NearbyLookup | None = None,
    lookup_permit: PermitLookup | None = None,
) -> HazardAnalysis:
    steps: list[PipelineStep] = []
    nearby: list[DuplicateMatch] = []
    geocode_label: str | None = None
    road_name: str | None = None
    street_permit: StreetPermitMatch | None = None

    _jpeg, data_uri = prepare_jpeg(image_bytes)
    if latitude is None or longitude is None:
        exif_lat, exif_lng = extract_exif_gps(image_bytes)
        latitude = latitude if latitude is not None else exif_lat
        longitude = longitude if longitude is not None else exif_lng

    vision, vision_step = _timed("see", vision_model(), lambda: vision_mod.analyze_image(data_uri))
    steps.append(vision_step)
    if not isinstance(vision, VisionResult):
        empty = _empty_analysis(steps, persist_error=vision_step.detail.get("error"))
        empty.agent_loop = build_agent_loop(
            vision=None,
            ocr=None,
            agent=None,
            latitude=latitude,
            longitude=longitude,
            geocode_label=None,
            nearby=[],
            duplicate=False,
            routing={},
            status="detected",
            street_permit=None,
        )
        empty.contract = team_contract(empty)
        return empty

    if not vision.hazard_detected:
        none_found = HazardAnalysis(
            hazard_detected=False,
            hazard_type="none",
            severity=None,
            confidence=vision.confidence,
            latitude=latitude,
            longitude=longitude,
            description=vision.description,
            priority_score=0,
            duplicate=False,
            target_category="",
            generated_report="",
            lane_impact=vision.lane_impact,
            ai_reasoning=vision.ai_reasoning,
            pipeline=steps,
        )
        none_found.agent_loop = build_agent_loop(
            vision=vision,
            ocr=None,
            agent=None,
            latitude=latitude,
            longitude=longitude,
            geocode_label=None,
            nearby=[],
            duplicate=False,
            routing={},
            status="detected",
            street_permit=None,
        )
        none_found.contract = team_contract(none_found)
        return none_found

    ocr, ocr_step = _timed("ocr", ocr_model(), lambda: ocr_mod.extract_text(data_uri))
    steps.append(ocr_step)
    if not isinstance(ocr, OcrResult):
        ocr = OcrResult()

    if reverse_geocode and latitude is not None and longitude is not None:
        geo_value, geo_step = _timed(
            "locate",
            "nominatim",
            lambda: reverse_geocode(latitude, longitude),  # type: ignore[arg-type]
        )
        steps.append(geo_step)
        geocode_label, road_name = _geocode_parts(geo_value)

    if lookup_permit and latitude is not None and longitude is not None:
        permit, permit_step = _timed(
            "permit",
            "sfgov:x8nh-xzn6",
            lambda: lookup_permit(latitude, longitude, road_name),  # type: ignore[misc]
        )
        steps.append(permit_step)
        if isinstance(permit, StreetPermitMatch):
            street_permit = permit

    if lookup_nearby and latitude is not None and longitude is not None:
        found, check_step = _timed(
            "check",
            "sf311+roadwatch",
            lambda: lookup_nearby(vision.hazard_type, latitude, longitude),  # type: ignore[arg-type]
        )
        steps.append(check_step)
        if isinstance(found, list):
            nearby = found

    routing = default_routing(vision.hazard_type)
    context = {
        "hazard_type": vision.hazard_type,
        "severity": vision.severity,
        "confidence": vision.confidence,
        "lane_impact": vision.lane_impact,
        "road_impact": vision.road_impact,
        "description": vision.description,
        "ai_reasoning": vision.ai_reasoning,
        "visible_text": vision.visible_text,
        "ocr_text": ocr.text,
        "ocr_street_signals": ocr.street_signals,
        "latitude": latitude,
        "longitude": longitude,
        "reverse_geocode": geocode_label,
        "street_name": None if street_permit is None else street_permit.street_name or road_name,
        "street_permit": None if street_permit is None else street_permit.model_dump(),
        "suggested_routing": routing,
        "nearby_reports": [item.model_dump() for item in nearby],
        "base_priority_score": base_priority(vision.severity, vision.lane_impact, vision.confidence),
        "city": os.environ.get("ROADWATCH_CITY", "San Francisco"),
    }

    agent, agent_step = _timed("act", agent_model(), lambda: agent_mod.route_and_report(context))
    steps.append(agent_step)
    if not isinstance(agent, AgentResult):
        agent = AgentResult(
            location_label=geocode_label or "Unknown location",
            location_confidence="low" if latitude is not None else "none",
            civic_category=routing["civic_category"],
            target_agency=routing["target_agency"],
            generated_report=vision.description,
            priority_score=base_priority(vision.severity, vision.lane_impact, vision.confidence),
            duplicate=bool(nearby),
            duplicate_reason=nearby[0].summary if nearby else "",
            human_review_required=vision.severity == "critical" or vision.hazard_type == "collision",
        )

    if vision.severity == "critical" or vision.hazard_type == "collision":
        agent.human_review_required = True
    if not agent.civic_category:
        agent.civic_category = routing["civic_category"]
    if not agent.target_agency:
        agent.target_agency = routing["target_agency"]

    closest = nearby[0] if nearby else None
    duplicate = agent.duplicate or bool(closest and closest.distance_meters <= 25)
    status = "report_ready"
    if agent.human_review_required:
        status = "detected"

    analysis = HazardAnalysis(
        hazard_detected=True,
        hazard_type=vision.hazard_type,
        severity=vision.severity,
        confidence=vision.confidence,
        latitude=latitude,
        longitude=longitude,
        description=vision.description,
        priority_score=agent.priority_score,
        duplicate=duplicate,
        target_category=agent.civic_category,
        generated_report=agent.generated_report,
        lane_impact=vision.lane_impact,
        location_label=agent.location_label,
        location_confidence=agent.location_confidence,
        ocr_text=ocr.text,
        ai_reasoning=vision.ai_reasoning,
        civic_category=agent.civic_category,
        target_agency=agent.target_agency,
        human_review_required=agent.human_review_required,
        duplicate_match=closest if duplicate else None,
        nearby_reports=nearby,
        status=status,
        pipeline=steps,
        agent=None if street_permit is None else street_permit.agent,
        agent_phone=None if street_permit is None else street_permit.agent_phone,
        street_permit=street_permit,
    )
    analysis.agent_loop = build_agent_loop(
        vision=vision,
        ocr=ocr,
        agent=agent,
        latitude=latitude,
        longitude=longitude,
        geocode_label=geocode_label,
        nearby=nearby,
        duplicate=duplicate,
        routing=routing,
        status=status,
        street_permit=street_permit,
    )
    analysis.contract = team_contract(analysis)
    return analysis
