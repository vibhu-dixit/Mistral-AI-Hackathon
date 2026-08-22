from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_hazards_returns_array_shape() -> None:
    response = client.get("/api/hazards")
    assert response.status_code == 200
    body = response.json()
    assert "hazards" in body
    assert isinstance(body["hazards"], list)


def test_missing_hazard_is_404() -> None:
    response = client.get("/api/hazards/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
