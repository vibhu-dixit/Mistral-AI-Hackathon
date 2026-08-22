from __future__ import annotations

import base64
import io

import pillow_heif
from PIL import Image, ImageOps

# Lets Image.open() read HEIC/HEIF (iPhone default camera format) as if it
# were any other format — without this, Pillow can't open them at all.
pillow_heif.register_heif_opener()

MAX_SIDE = 1568


def prepare_jpeg(image_bytes: bytes) -> tuple[bytes, str]:
    """Downscale/orient the image and return JPEG bytes plus a data URI."""
    with Image.open(io.BytesIO(image_bytes)) as src:
        image = ImageOps.exif_transpose(src)
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        elif image.mode == "L":
            image = image.convert("RGB")
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        image.save(buf, format="JPEG", quality=85, optimize=True)
    jpeg = buf.getvalue()
    b64 = base64.b64encode(jpeg).decode("ascii")
    return jpeg, f"data:image/jpeg;base64,{b64}"
