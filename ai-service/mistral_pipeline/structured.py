VISION_JSON_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "hazard_detected": {"type": "boolean"},
        "hazard_type": {
            "type": "string",
            "enum": [
                "pothole",
                "road_debris",
                "blocked_lane",
                "flooding",
                "collision",
                "damaged_signage",
                "none",
            ],
        },
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "severity": {
            "anyOf": [
                {"type": "string", "enum": ["routine", "urgent", "critical"]},
                {"type": "null"},
            ]
        },
        "lane_impact": {"type": "string", "enum": ["none", "partial", "full"]},
        "road_impact": {"type": "string"},
        "description": {"type": "string"},
        "ai_reasoning": {"type": "string"},
        "visible_text": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "hazard_detected",
        "hazard_type",
        "confidence",
        "severity",
        "lane_impact",
        "road_impact",
        "description",
        "ai_reasoning",
        "visible_text",
    ],
}

AGENT_JSON_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "location_label": {"type": "string"},
        "location_confidence": {"type": "string", "enum": ["high", "medium", "low", "none"]},
        "civic_category": {"type": "string"},
        "target_agency": {"type": "string"},
        "generated_report": {"type": "string"},
        "priority_score": {"type": "integer", "minimum": 0, "maximum": 100},
        "duplicate": {"type": "boolean"},
        "duplicate_reason": {"type": "string"},
        "human_review_required": {"type": "boolean"},
    },
    "required": [
        "location_label",
        "location_confidence",
        "civic_category",
        "target_agency",
        "generated_report",
        "priority_score",
        "duplicate",
        "duplicate_reason",
        "human_review_required",
    ],
}


def json_schema_format(name: str, schema: dict) -> dict:
    return {
        "type": "json_schema",
        "json_schema": {
            "name": name,
            "schema": schema,
            "strict": True,
        },
    }
