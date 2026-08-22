from app.present import present_row, to_db_hazard_type, to_ui_hazard_type


def test_road_debris_maps_to_ui_debris() -> None:
    assert to_ui_hazard_type("road_debris") == "debris"
    assert to_db_hazard_type("debris") == "road_debris"


def test_present_row_uses_ui_field_names() -> None:
    row = present_row(
        {
            "id": "abc",
            "hazard_type": "road_debris",
            "severity": "urgent",
            "confidence": 0.9,
            "latitude": 37.7,
            "longitude": -122.4,
            "location_label": "Folsom St",
            "description": "Debris in lane",
            "ai_reasoning": "Visible obstruction",
            "is_duplicate": False,
            "civic_category": "Street Defect",
            "generated_report": "Report text",
            "status": "report_ready",
            "created_at": "2026-08-22T00:00:00Z",
            "priority_score": 70,
            "votes": 4,
            "duplicate_distance_m": 18.5,
            "image_url": "https://example.supabase.co/storage/v1/object/public/hazard-media/hazards/abc/a.jpg",
            "agent": "Esquivel Grading & Paving, Inc.",
            "agent_phone": "415-468 5700",
            "permit_street_name": "LOMBARD ST",
            "permit_number": "26EXC-02187",
            "permit_type": "EXCAVATION",
            "permit_status": "ACTIVE",
            "permit_distance_m": 12.4,
        }
    )
    assert row["hazard_type"] == "debris"
    assert row["target_category"] == "Street Defect"
    assert row["detected_at"] == "2026-08-22T00:00:00Z"
    assert row["duplicate"] is False
    assert row["votes"] == 4
    assert row["duplicate_distance_m"] == 18.5
    assert row["image_url"] == "/api/hazards/abc/image"
    assert row["agent"] == "Esquivel Grading & Paving, Inc."
    assert row["agent_phone"] == "415-468 5700"
    assert row["permit_street_name"] == "LOMBARD ST"
    assert row["permit_number"] == "26EXC-02187"


def test_present_row_returns_blank_permit_fields() -> None:
    row = present_row(
        {
            "id": "abc",
            "hazard_type": "pothole",
            "severity": "routine",
            "confidence": 0.5,
            "latitude": 37.7,
            "longitude": -122.4,
            "description": "Hole",
            "priority_score": 10,
        }
    )
    assert row["agent"] == ""
    assert row["agent_phone"] == ""
    assert row["permit_street_name"] == ""
    assert row["permit_number"] == ""
    assert row["permit_type"] == ""
    assert row["permit_status"] == ""
