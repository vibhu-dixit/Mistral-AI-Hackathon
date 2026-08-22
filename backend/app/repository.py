import json
import os
from typing import Any

import httpx

from .models import Observation


class ObservationRepository:
    def __init__(self) -> None:
        self._memory: dict[str, Observation] = {}
        self._url = os.getenv("SUPABASE_URL")
        self._key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    def save(self, observation: Observation) -> Observation:
        self._memory[observation.id] = observation
        if self._url and self._key:
            self._insert_supabase(observation)
        return observation

    def list(self) -> list[Observation]:
        return list(self._memory.values())

    def get(self, observation_id: str) -> Observation | None:
        return self._memory.get(observation_id)

    def _insert_supabase(self, observation: Observation) -> None:
        payload: dict[str, Any] = json.loads(observation.model_dump_json())
        payload["coordinates"] = (
            payload["coordinates"] if payload["coordinates"] else None
        )
        response = httpx.post(
            f"{self._url}/rest/v1/observations",
            headers={
                "apikey": self._key,
                "Authorization": f"Bearer {self._key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
