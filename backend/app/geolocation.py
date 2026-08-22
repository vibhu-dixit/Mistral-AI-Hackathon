from io import BytesIO
from typing import Any

import pillow_heif
from PIL import ExifTags, Image

from .models import Coordinates, LocationSource

# Idempotent — safe even if mistral_pipeline.images/geo already did this in
# the same process. Without it, Image.open() can't read HEIC at all, so
# EXIF GPS extraction silently returns None for iPhone photos.
pillow_heif.register_heif_opener()


def _as_float(value: Any) -> float:
    if hasattr(value, "numerator") and hasattr(value, "denominator"):
        return float(value.numerator) / float(value.denominator)
    return float(value)


def _dms_to_decimal(value: Any, reference: str) -> float:
    degrees, minutes, seconds = (_as_float(part) for part in value)
    decimal = degrees + minutes / 60 + seconds / 3600
    return -decimal if reference in {"S", "W"} else decimal


def extract_exif_coordinates(image_bytes: bytes) -> Coordinates | None:
    try:
        image = Image.open(BytesIO(image_bytes))
        exif = image.getexif()
        # GPSInfo (tag 34853) is a nested IFD, not a flat value — get_ifd()
        # resolves it to the {tag: value} dict; exif.get(34853) returns
        # just the IFD's byte offset as a plain int on modern Pillow.
        gps = exif.get_ifd(ExifTags.IFD.GPSInfo)
        if not gps:
            return None

        latitude = gps.get(2)
        longitude = gps.get(4)
        latitude_ref = gps.get(1, "N")
        longitude_ref = gps.get(3, "E")
        if not latitude or not longitude:
            return None

        if isinstance(latitude_ref, bytes):
            latitude_ref = latitude_ref.decode("ascii", errors="ignore")
        if isinstance(longitude_ref, bytes):
            longitude_ref = longitude_ref.decode("ascii", errors="ignore")

        return Coordinates(
            latitude=_dms_to_decimal(latitude, str(latitude_ref)),
            longitude=_dms_to_decimal(longitude, str(longitude_ref)),
        )
    except (KeyError, TypeError, ValueError, OSError, ZeroDivisionError, AttributeError):
        return None


def resolve_coordinates(
    image_bytes: bytes,
    client_lat: float | None,
    client_lng: float | None,
) -> tuple[Coordinates | None, LocationSource, float]:
    exif_coordinates = extract_exif_coordinates(image_bytes)
    if exif_coordinates:
        return exif_coordinates, "exif", 1.0

    if client_lat is not None and client_lng is not None:
        return Coordinates(latitude=client_lat, longitude=client_lng), "client_gps", 0.8

    return None, "unavailable", 0.0
