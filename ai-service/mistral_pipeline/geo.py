from __future__ import annotations

import io
from math import asin, cos, radians, sin, sqrt

from PIL import Image, ExifTags


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371000.0
    p1, p2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dlmb = radians(lon2 - lon1)
    a = sin(dphi / 2) ** 2 + cos(p1) * cos(p2) * sin(dlmb / 2) ** 2
    return 2 * radius * asin(sqrt(a))


def _to_float(value) -> float:
    if isinstance(value, tuple) and len(value) == 2:
        return float(value[0]) / float(value[1])
    return float(value)


def _dms_to_deg(values) -> float:
    degrees, minutes, seconds = values
    return _to_float(degrees) + _to_float(minutes) / 60.0 + _to_float(seconds) / 3600.0


def extract_exif_gps(image_bytes: bytes) -> tuple[float | None, float | None]:
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            exif = img.getexif()
            if not exif:
                return None, None
            gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)
    except Exception:
        return None, None
    if not gps_ifd:
        return None, None

    gps_lat = gps_ifd.get(2)
    gps_lat_ref = gps_ifd.get(1)
    gps_lon = gps_ifd.get(4)
    gps_lon_ref = gps_ifd.get(3)
    if not gps_lat or not gps_lon:
        return None, None
    try:
        lat = _dms_to_deg(gps_lat)
        lon = _dms_to_deg(gps_lon)
    except Exception:
        return None, None
    if isinstance(gps_lat_ref, bytes):
        gps_lat_ref = gps_lat_ref.decode("ascii", errors="ignore")
    if isinstance(gps_lon_ref, bytes):
        gps_lon_ref = gps_lon_ref.decode("ascii", errors="ignore")
    if str(gps_lat_ref).upper() == "S":
        lat = -lat
    if str(gps_lon_ref).upper() == "W":
        lon = -lon
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return None, None
    return lat, lon
