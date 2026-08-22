from __future__ import annotations

import json
from typing import Any

import httpx

from app.config import supabase_key, supabase_url
from app.models import Observation

TABLE = "image_observations"


class ObservationRepository:
    def __init__(self) -> None:
        self._memory: dict[str, Observation] = {}

    def save(self, observation: Observation) -> Observation:
        self._memory[observation.id] = observation
        self._insert_supabase(observation)
        return observation

    def list(self) -> list[Observation]:
        return list(reversed(list(self._memory.values())))

    def get(self, observation_id: str) -> Observation | None:
        return self._memory.get(observation_id)

    def _insert_supabase(self, observation: Observation) -> None:
        url = supabase_url()
        key = supabase_key()
        if not url or not key:
            return
        payload: dict[str, Any] = json.loads(observation.model_dump_json())
        try:
            response = httpx.post(
                f"{url}/rest/v1/{TABLE}",
                headers={
                    "apikey": key,
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json=payload,
                timeout=10,
            )
            response.raise_for_status()
        except Exception:
            return
