from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AI_SERVICE = ROOT / "ai-service"
if str(AI_SERVICE) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE))

from datetime import datetime, timezone
from urllib.parse import unquote
from uuid import uuid4
from urllib.request import Request, urlopen

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from pydantic import BaseModel, Field

from app import config  # noqa: F401  loads .env
from app import hazard_memory
from app.analysis import analyze_observation
from app.duplicates import lookup_nearby
from app.geocode import reverse_geocode
from app.geolocation import resolve_coordinates
from app.models import Observation
from app.persist import persist_analysis
from app.present import permit_fields_from_match, present_analysis, present_row
from app.repository import ObservationRepository
from app.store import get_supabase
from app.street_permits import lookup_street_permit
from mistral_pipeline.images import prepare_jpeg
from mistral_pipeline.pipeline import analyze_photo

MAX_IMAGE_BYTES = 12 * 1024 * 1024
ALLOWED_STATUSES = {"detected", "report_ready", "reported", "in_progress", "resolved"}
SCHEMA_HINT = (
    "Supabase table public.hazards is missing. In the project SQL Editor "
    "(dashboard login is enough — no database password), run supabase/apply_all.sql once."
)


def _supabase_error(exc: Exception) -> str:
    message = str(exc)
    lowered = message.lower()
    if "could not find" in lowered or "does not exist" in lowered or "pgrst205" in lowered:
        return SCHEMA_HINT
    return message


def _is_missing_schema(exc: Exception) -> bool:
    lowered = str(exc).lower()
    return "could not find" in lowered or "does not exist" in lowered or "pgrst205" in lowered


def _enrich_permit(row: dict) -> dict:
    presented = present_row(row)
    if presented.get("agent") or presented.get("agent_phone") or presented.get("permit_number"):
        return presented
    try:
        latitude = float(row.get("latitude"))
        longitude = float(row.get("longitude"))
    except (TypeError, ValueError):
        return presented
    try:
        match = lookup_street_permit(latitude, longitude, street_name=row.get("location_label") or None)
    except Exception:
        match = None
    extra = permit_fields_from_match(match)
    presented.update(extra)
    if match and row.get("id"):
        updates = {key: value for key, value in extra.items() if value not in ("", None)}
        if updates:
            try:
                get_supabase().table("hazards").update(updates).eq("id", row["id"]).execute()
            except Exception:
                pass
    return presented


def _analysis_payload(result) -> dict:
    payload = result.model_dump()
    if not result.hazard_detected:
        return payload
    if not result.hazard_id:
        result.hazard_id = str(uuid4())
    row = present_analysis(result)
    hazard_memory.remember(row)
    payload.update(
        {
            "id": row["id"],
            "hazard_id": row["id"],
            "hazard_type": row["hazard_type"],
            "created_at": row["detected_at"],
            "detected_at": row["detected_at"],
            "votes": row["votes"],
            "target_category": row["target_category"],
            "duplicate": row["duplicate"],
            "image_url": row["image_url"],
            "persisted": result.persisted,
            "persist_error": result.persist_error,
            "agent": row.get("agent") or "",
            "agent_phone": row.get("agent_phone") or "",
            "permit_street_name": row.get("permit_street_name") or "",
            "permit_number": row.get("permit_number") or "",
            "permit_type": row.get("permit_type") or "",
            "permit_status": row.get("permit_status") or "",
            "permit_distance_m": row.get("permit_distance_m"),
        }
    )
    return payload

app = FastAPI(
    title="RoadWatch API",
    version="0.1.0",
    description="Ibrahim / Member 1 — image analysis, Mistral agent, SF311 duplicate check.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StatusUpdate(BaseModel):
    status: str | None = None
    votes: int | None = Field(default=None, ge=0)


class SubmitBody(BaseModel):
    note: str | None = Field(default=None)


repository = ObservationRepository()


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/health")
def health() -> dict[str, str]:
    return {"ok": "true", "service": "roadwatch-backend"}


@app.get("/agent-loop")
def agent_loop_doc() -> dict:
    return {
        "loop": ["see", "understand", "locate", "check", "prioritize", "route", "act"],
        "models": {
            "see": "mistral-small-latest (vision)",
            "ocr": "mistral-ocr-latest",
            "act": "mistral-small-latest (civic agent)",
        },
        "notes": [
            "GPS is the primary location signal; OCR corroborates.",
            "Collisions and critical hazards require human review.",
            "RoadWatch never auto-dispatches emergency services.",
        ],
    }


@app.get("/analyze-image/schema")
def analysis_schema() -> dict:
    return {
        "hazard_type": "pothole | road_debris | blocked_lane | flooding | collision | damaged_signage | none",
        "severity": "routine | urgent | critical | null",
        "confidence": 0,
        "latitude": 0,
        "longitude": 0,
        "description": "",
        "priority_score": 0,
        "duplicate": False,
        "target_category": "",
        "generated_report": "",
    }


@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(..., description="Road photo (jpeg, png, webp, heic)"),
    latitude: float | None = Form(default=None),
    longitude: float | None = Form(default=None),
    force_new: bool = Form(default=False),
):
    content_type = (file.content_type or "").lower()
    if content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Video is out of scope. Upload a still image.")
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 12MB or smaller")

    try:
        result = analyze_photo(
            raw,
            latitude=latitude,
            longitude=longitude,
            reverse_geocode=reverse_geocode,
            lookup_nearby=lookup_nearby,
            lookup_permit=lookup_street_permit,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if result.hazard_detected:
        jpeg, _ = prepare_jpeg(raw)
        try:
            persist_analysis(result, jpeg, force_new=force_new)
        except Exception as exc:
            result.persisted = False
            result.persist_error = str(exc)

    return _analysis_payload(result)


@app.post("/api/observations", response_model=Observation)
async def create_observation(
    image: UploadFile = File(...),
    client_lat: float | None = Form(default=None),
    client_lng: float | None = Form(default=None),
) -> Observation:
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Only image uploads are supported")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Image upload is empty")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 12MB or smaller")

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
    observation = await analyze_observation(observation, image_bytes)
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


@app.get("/api/hazards")
def list_hazards(limit: int = 200):
    try:
        client = get_supabase()
        result = (
            client.table("hazards")
            .select("*")
            .order("created_at", desc=True)
            .limit(min(limit, 500))
            .execute()
        )
        return {"hazards": [present_row(row) for row in (result.data or [])]}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=_supabase_error(exc)) from exc


def _stored_image_url(hazard_id: str) -> str | None:
    client = get_supabase()
    result = client.table("hazards").select("image_url").eq("id", hazard_id).limit(1).execute()
    rows = result.data or []
    if not rows:
        return None
    url = rows[0].get("image_url")
    return str(url) if url else None


def _download_stored_image(stored_url: str) -> tuple[bytes, str]:
    marker = "/object/public/hazard-media/"
    storage_path = None
    if marker in stored_url:
        storage_path = unquote(stored_url.split(marker, 1)[1].split("?", 1)[0])
    if storage_path:
        data = get_supabase().storage.from_("hazard-media").download(storage_path)
        if data:
            return bytes(data), "image/jpeg"
    request = Request(stored_url, headers={"User-Agent": "RoadWatch/1.0"})
    with urlopen(request, timeout=20) as response:
        content_type = (response.headers.get("Content-Type") or "image/jpeg").split(";", 1)[0].strip()
        return response.read(), content_type


@app.get("/api/hazards/{hazard_id}/image")
def get_hazard_image(hazard_id: str):
    try:
        stored_url = _stored_image_url(hazard_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=_supabase_error(exc)) from exc
    if not stored_url:
        raise HTTPException(status_code=404, detail="Hazard image not found")
    try:
        data, content_type = _download_stored_image(stored_url)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not fetch hazard image: {exc}") from exc
    return Response(
        content=data,
        media_type=content_type or "image/jpeg",
        headers={"Cache-Control": "public, max-age=300"},
    )


@app.get("/api/hazards/{hazard_id}")
def get_hazard(hazard_id: str):
    try:
        client = get_supabase()
        result = client.table("hazards").select("*").eq("id", hazard_id).limit(1).execute()
        rows = result.data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Hazard not found")
        reports = (
            client.table("reports").select("*").eq("hazard_id", hazard_id).order("created_at", desc=True).execute()
        )
        observations = (
            client.table("observations").select("*").eq("hazard_id", hazard_id).order("observed_at", desc=True).execute()
        )
        return {
            **_enrich_permit(rows[0]),
            "reports": reports.data or [],
            "observations": observations.data or [],
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=_supabase_error(exc)) from exc


@app.patch("/api/hazards/{hazard_id}")
def patch_hazard(hazard_id: str, body: StatusUpdate):
    updates: dict = {}
    if body.status is not None:
        if body.status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=400, detail=f"status must be one of {sorted(ALLOWED_STATUSES)}")
        updates["status"] = body.status
    if body.votes is not None:
        updates["votes"] = body.votes
    if not updates:
        raise HTTPException(status_code=400, detail="status or votes is required")
    try:
        client = get_supabase()
        result = client.table("hazards").update(updates).eq("id", hazard_id).execute()
        row = result.data[0] if result.data else None
        if row is None:
            fetched = client.table("hazards").select("*").eq("id", hazard_id).limit(1).execute()
            if not fetched.data:
                raise HTTPException(status_code=404, detail="Hazard not found")
            row = fetched.data[0]
        presented = present_row(row)
        hazard_memory.update(hazard_id, **updates)
        return presented
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=_supabase_error(exc)) from exc


@app.post("/api/hazards/{hazard_id}/submit")
def submit_report(hazard_id: str, body: SubmitBody | None = None):
    """Simulated municipal submission — does not call the real SF311 write API."""
    try:
        client = get_supabase()
        existing = client.table("hazards").select("*").eq("id", hazard_id).limit(1).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Hazard not found")
        row = present_row(existing.data[0])
        if row.get("hazard_type") == "collision" or row.get("severity") == "critical":
            client.table("hazards").update({"status": "detected"}).eq("id", hazard_id).execute()
            hazard_memory.update(hazard_id, status="detected")
            raise HTTPException(
                status_code=409,
                detail="Critical / collision reports stay in human review and are not auto-submitted.",
            )
        case_id = f"RW-SIM-{hazard_id[:8].upper()}"
        client.table("hazards").update({"status": "reported"}).eq("id", hazard_id).execute()
        reports = client.table("reports").select("id").eq("hazard_id", hazard_id).execute()
        if reports.data:
            client.table("reports").update(
                {
                    "status": "submitted_simulated",
                    "external_case_id": case_id,
                }
            ).eq("hazard_id", hazard_id).execute()
        hazard_memory.update(hazard_id, status="reported")
        return {
            "ok": True,
            "simulated": True,
            "external_case_id": case_id,
            "status": "reported",
            "note": body.note if body else None,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=_supabase_error(exc)) from exc
