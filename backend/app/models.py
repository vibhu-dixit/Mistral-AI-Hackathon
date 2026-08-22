from typing import Literal

from pydantic import BaseModel, Field

LocationSource = Literal["exif", "client_gps", "ocr", "unavailable"]
ProcessingStatus = Literal["queued", "processing", "complete", "failed"]
Severity = Literal["routine", "urgent", "critical"]


class Coordinates(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class Observation(BaseModel):
    id: str
    asset_name: str
    coordinates: Coordinates | None
    location_source: LocationSource
    location_confidence: float = Field(ge=0, le=1)
    ocr_text: str | None = None
    hazard_type: str | None = None
    severity: Severity | None = None
    confidence: float | None = Field(default=None, ge=0, le=1)
    description: str | None = None
    processing_status: ProcessingStatus
    created_at: str
    generated_report: str | None = None
    duplicate: bool = False
    hazard_id: str | None = None
    agent: str | None = None
    agent_phone: str | None = None
