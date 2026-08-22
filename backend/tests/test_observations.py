from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app import geolocation
from app.models import Observation

client = TestClient(app)


async def _stub_analysis(observation: Observation, image_bytes: bytes) -> Observation:
    observation.hazard_type = "pothole"
    observation.severity = "urgent"
    observation.confidence = 0.92
    observation.description = "Road surface damage detected in the uploaded image."
    observation.processing_status = "complete"
    return observation


def test_image_observation_uses_client_gps_when_exif_is_missing(monkeypatch) -> None:
    monkeypatch.setattr("app.main.analyze_observation", _stub_analysis)

    image = BytesIO()
    Image.new("RGB", (10, 10), "white").save(image, format="JPEG")
    image.seek(0)

    response = client.post(
        "/api/observations",
        files={"image": ("road.jpg", image, "image/jpeg")},
        data={"client_lat": "37.7749", "client_lng": "-122.4194"},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["location_source"] == "client_gps"
    assert result["coordinates"] == {"latitude": 37.7749, "longitude": -122.4194}
    assert result["hazard_type"] == "pothole"
    assert result["processing_status"] == "complete"


def test_exif_gps_takes_precedence_over_client_gps(monkeypatch) -> None:
    monkeypatch.setattr("app.main.analyze_observation", _stub_analysis)
    monkeypatch.setattr(
        geolocation,
        "extract_exif_coordinates",
        lambda image_bytes: geolocation.Coordinates(
            latitude=37.7750, longitude=-122.4180
        ),
    )

    response = client.post(
        "/api/observations",
        files={"image": ("road.jpg", b"image-bytes", "image/jpeg")},
        data={"client_lat": "1", "client_lng": "1"},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["location_source"] == "exif"
    assert result["coordinates"] == {"latitude": 37.775, "longitude": -122.418}
