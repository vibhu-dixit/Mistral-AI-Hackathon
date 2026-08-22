from __future__ import annotations

from mistral_pipeline.schemas import HazardType

ROUTING: dict[str, dict[str, str]] = {
    "pothole": {
        "civic_category": "Street Defect",
        "target_agency": "San Francisco Public Works via SF311",
    },
    "road_debris": {
        "civic_category": "Street and Sidewalk Cleaning",
        "target_agency": "San Francisco Public Works via SF311",
    },
    "blocked_lane": {
        "civic_category": "Blocked Street or Sidewalk",
        "target_agency": "SFMTA / San Francisco Public Works via SF311",
    },
    "flooding": {
        "civic_category": "Flooding",
        "target_agency": "SFPUC / San Francisco Public Works via SF311",
    },
    "collision": {
        "civic_category": "Human review — do not auto-dispatch",
        "target_agency": "Human review (not emergency dispatch)",
    },
    "damaged_signage": {
        "civic_category": "Damaged Property — Street or Traffic Sign",
        "target_agency": "SFMTA via SF311",
    },
}

SF311_KEYWORDS: dict[str, tuple[str, ...]] = {
    "pothole": ("pothole", "pavement", "street defect", "asphalt", "roadway"),
    "road_debris": ("debris", "garbage", "obstruction", "cleaning", "dumping"),
    "blocked_lane": ("blocked", "obstruction", "abandoned", "construction", "encampment"),
    "flooding": ("flood", "water", "catch basin", "drain", "sewer"),
    "collision": ("collision", "crash", "accident"),
    "damaged_signage": ("sign", "signal", "traffic sign"),
}


def default_routing(hazard_type: HazardType | str) -> dict[str, str]:
    return ROUTING.get(
        str(hazard_type),
        {
            "civic_category": "Street Defect",
            "target_agency": "San Francisco Public Works via SF311",
        },
    )


def base_priority(severity: str | None, lane_impact: str, confidence: float) -> int:
    score = {"routine": 32, "urgent": 68, "critical": 90}.get(severity or "", 20)
    if lane_impact == "full":
        score += 8
    elif lane_impact == "partial":
        score += 4
    if confidence >= 0.85:
        score += 4
    return max(0, min(100, score))
