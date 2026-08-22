from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from .analysis import analyze_observation
from .geolocation import resolve_coordinates
from .models import Observation
from .repository import ObservationRepository

app = FastAPI(title="RoadWatch Observation API", version="0.1.0")
repository = ObservationRepository()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/observations", response_model=Observation)
async def create_observation(
    image: UploadFile = File(...),
    client_lat: float | None = Form(default=None),
    client_lng: float | None = Form(default=None),
) -> Observation:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Only image uploads are supported")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Image upload is empty")

    coordinates, source, location_confidence = resolve_coordinates(
        image_bytes, client_lat, client_lng
    )
    observation = Observation(
        id=str(uuid4()),
        asset_name=image.filename or "upload",
        coordinates=coordinates,
        location_source=source,
        location_confidence=location_confidence,
        processing_status="processing",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    observation = await analyze_observation(observation)
    repository.save(observation)
    return observation


@app.get("/api/observations", response_model=list[Observation])
def list_observations() -> list[Observation]:
    return repository.list()


@app.get("/api/observations/{observation_id}", response_model=Observation)
def get_observation(observation_id: str) -> Observation:
    observation = repository.get(observation_id)
    if not observation:
        raise HTTPException(status_code=404, detail="Observation not found")
    return observation
