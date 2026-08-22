from __future__ import annotations

import os

from mistralai.client import Mistral

_client: Mistral | None = None


def get_client() -> Mistral:
    global _client
    api_key = os.environ.get("MISTRAL_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("MISTRAL_API_KEY is not set")
    if _client is None:
        _client = Mistral(api_key=api_key)
    return _client


def vision_model() -> str:
    return os.environ.get("MISTRAL_VISION_MODEL", "mistral-small-latest")


def ocr_model() -> str:
    return os.environ.get("MISTRAL_OCR_MODEL", "mistral-ocr-latest")


def agent_model() -> str:
    return os.environ.get("MISTRAL_AGENT_MODEL", "mistral-small-latest")
