from __future__ import annotations

import re

from mistral_pipeline.client import get_client, ocr_model
from mistral_pipeline.schemas import OcrResult

STREET_HINT = re.compile(
    r"\b([A-Z0-9][A-Za-z0-9.'\-]*(?:\s+[A-Z0-9][A-Za-z0-9.'\-]*)*)\s+"
    r"(St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Dr|Drive|Way|Hwy|Highway|Ln|Lane)\b",
    re.IGNORECASE,
)


def extract_text(data_uri: str) -> OcrResult:
    client = get_client()
    model = ocr_model()
    response = client.ocr.process(
        model=model,
        document={
            "type": "image_url",
            "image_url": data_uri,
        },
    )
    pages = getattr(response, "pages", None) or []
    chunks: list[str] = []
    for page in pages:
        markdown = getattr(page, "markdown", "") or ""
        if markdown.strip():
            chunks.append(markdown.strip())
    text = "\n".join(chunks).strip()
    signals = [match.group(0).strip() for match in STREET_HINT.finditer(text)]
    # de-dupe while preserving order
    seen: set[str] = set()
    unique: list[str] = []
    for item in signals:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return OcrResult(text=text, street_signals=unique)
