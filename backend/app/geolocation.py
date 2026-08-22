from io import BytesIO
from typing import Any

from PIL import Image

from .models import Coordinates, LocationSource


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
        gps = exif.get(34853)
        if not gps:
            return None

        latitude = gps.get(2)
        longitude = gps.get(4)
        latitude_ref = gps.get(1, "N")
        longitude_ref = gps.get(3, "E")
        if not latitude or not longitude:
            return None

        coordinates = Coordinates(
            latitude=_dms_to_decimal(latitude, latitude_ref),
            longitude=_dms_to_decimal(longitude, longitude_ref),
        )
        return coordinates
    except (KeyError, TypeError, ValueError, OSError):
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
