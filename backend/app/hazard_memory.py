from __future__ import annotations

from typing import Any

_rows: dict[str, dict[str, Any]] = {}


def remember(row: dict[str, Any]) -> None:
    hazard_id = str(row.get("id") or "")
    if not hazard_id:
        return
    current = _rows.get(hazard_id, {})
    current.update(row)
    _rows[hazard_id] = current


def list_all() -> list[dict[str, Any]]:
    return sorted(
        _rows.values(),
        key=lambda item: str(item.get("detected_at") or ""),
        reverse=True,
    )


def get(hazard_id: str) -> dict[str, Any] | None:
    return _rows.get(hazard_id)


def update(hazard_id: str, **fields: Any) -> dict[str, Any] | None:
    row = _rows.get(hazard_id)
    if not row:
        return None
    row.update(fields)
    return row
