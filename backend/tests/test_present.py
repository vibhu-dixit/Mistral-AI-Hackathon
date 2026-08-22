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
        }
    )
    assert row["hazard_type"] == "debris"
    assert row["target_category"] == "Street Defect"
    assert row["detected_at"] == "2026-08-22T00:00:00Z"
    assert row["duplicate"] is False
    assert row["votes"] == 0
