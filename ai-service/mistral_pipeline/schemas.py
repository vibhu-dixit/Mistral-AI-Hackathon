from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

HazardType = Literal[
    "pothole",
    "road_debris",
    "blocked_lane",
    "flooding",
    "collision",
    "damaged_signage",
    "none",
]

Severity = Literal["routine", "urgent", "critical"]
LaneImpact = Literal["none", "partial", "full"]
LocationConfidence = Literal["high", "medium", "low", "none"]


class VisionResult(BaseModel):
    hazard_detected: bool
    hazard_type: HazardType
    confidence: float = Field(ge=0, le=1)
    severity: Severity | None = None
    lane_impact: LaneImpact = "none"
    road_impact: str = ""
    description: str = ""
    ai_reasoning: str = ""
    visible_text: list[str] = Field(default_factory=list)


class OcrResult(BaseModel):
    text: str = ""
    street_signals: list[str] = Field(default_factory=list)


class DuplicateMatch(BaseModel):
    source: Literal["roadwatch", "sf311"]
    id: str
    hazard_type: str | None = None
    category: str | None = None
    distance_meters: float
    status: str | None = None
    summary: str = ""
    latitude: float | None = None
    longitude: float | None = None


class StreetPermitMatch(BaseModel):
    """Contractor on an SF Active Street Use Permit near the photo GPS."""

    agent: str | None = None
    agent_phone: str | None = None
    street_name: str | None = None
    permit_number: str | None = None
    permit_type: str | None = None
    status: str | None = None
    distance_meters: float | None = None
    street_match: bool = False


class AgentResult(BaseModel):
    location_label: str
    location_confidence: LocationConfidence
    civic_category: str
    target_agency: str
    generated_report: str
    priority_score: int = Field(ge=0, le=100)
    duplicate: bool = False
    duplicate_reason: str = ""
    human_review_required: bool = False


class PipelineStep(BaseModel):
    name: str
    model: str | None = None
    ms: int
    ok: bool = True
    detail: dict[str, Any] = Field(default_factory=dict)


class HazardAnalysis(BaseModel):
    """Shared contract for frontend, dashboard, and backend."""

    hazard_type: str
    severity: str | None
    confidence: float
    latitude: float | None
    longitude: float | None
    description: str
    priority_score: int
    duplicate: bool
    target_category: str
    generated_report: str
    lane_impact: str = "none"
    location_label: str = ""
    location_confidence: str = "none"
    ocr_text: str = ""
    ai_reasoning: str = ""
    civic_category: str = ""
    target_agency: str = ""
    human_review_required: bool = False
    duplicate_match: DuplicateMatch | None = None
    nearby_reports: list[DuplicateMatch] = Field(default_factory=list)
    hazard_detected: bool = False
    image_url: str | None = None
    hazard_id: str | None = None
    status: str = "detected"
    pipeline: list[PipelineStep] = Field(default_factory=list)
    agent_loop: dict[str, Any] = Field(default_factory=dict)
    contract: dict[str, Any] = Field(default_factory=dict)
    persisted: bool = False
    persist_error: str | None = None
    linked_to_existing: bool = False
    agent: str | None = None
    agent_phone: str | None = None
    street_permit: StreetPermitMatch | None = None
