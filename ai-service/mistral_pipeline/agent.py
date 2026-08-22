from __future__ import annotations

from typing import Any

from mistral_pipeline.client import agent_model, get_client
from mistral_pipeline.jsonutil import parse_json_object
from mistral_pipeline.prompts import AGENT_SYSTEM, agent_user_prompt
from mistral_pipeline.schemas import AgentResult
from mistral_pipeline.structured import AGENT_JSON_SCHEMA, json_schema_format

CONFIDENCE = {"high", "medium", "low", "none"}


def route_and_report(context: dict[str, Any]) -> AgentResult:
    client = get_client()
    model = agent_model()
    messages = [
        {"role": "system", "content": AGENT_SYSTEM},
        {"role": "user", "content": agent_user_prompt(context)},
    ]
    formats = (
        json_schema_format("civic_agent", AGENT_JSON_SCHEMA),
        {"type": "json_object"},
    )
    data: dict[str, Any] | None = None
    last_error: Exception | None = None
    for response_format in formats:
        try:
            response = client.chat.complete(
                model=model,
                messages=messages,
                response_format=response_format,
                temperature=0.2,
            )
            raw = response.choices[0].message.content or ""
            data = parse_json_object(raw)
            last_error = None
            break
        except Exception as exc:
            last_error = exc
    if data is None:
        raise last_error or RuntimeError("agent returned no JSON")
    confidence = str(data.get("location_confidence") or "none").lower()
    if confidence not in CONFIDENCE:
        confidence = "none"
    score = int(data.get("priority_score") or 0)
    score = max(0, min(100, score))
    return AgentResult(
        location_label=str(data.get("location_label") or "Unknown location"),
        location_confidence=confidence,  # type: ignore[arg-type]
        civic_category=str(data.get("civic_category") or ""),
        target_agency=str(data.get("target_agency") or ""),
        generated_report=str(data.get("generated_report") or ""),
        priority_score=score,
        duplicate=bool(data.get("duplicate")),
        duplicate_reason=str(data.get("duplicate_reason") or ""),
        human_review_required=bool(data.get("human_review_required")),
    )
