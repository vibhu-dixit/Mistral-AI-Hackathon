from __future__ import annotations

import io
import re
from math import asin, cos, radians, sin, sqrt

import pillow_heif
from PIL import Image, ExifTags

# Registering here too (not just images.py) — this module opens the image
# independently for EXIF GPS extraction, and register_heif_opener() is
# idempotent, so it's safe to call from both places regardless of import
# order. Without it, HEIC uploads silently return (None, None) here instead
# of raising, since the caller only checks "did we get coordinates."
pillow_heif.register_heif_opener()

# SF Active Street Use Permits (`streetname`) uses ALL CAPS + USPS suffixes
# and zero-pads numbered streets (`08TH ST`, `01ST ST`).
_STREET_SUFFIXES = {
    "STREET": "ST",
    "STR": "ST",
    "ST": "ST",
    "AVENUE": "AVE",
    "AVE": "AVE",
    "AV": "AVE",
    "BOULEVARD": "BLVD",
    "BLVD": "BLVD",
    "DRIVE": "DR",
    "DR": "DR",
    "ROAD": "RD",
    "RD": "RD",
    "COURT": "CT",
    "CT": "CT",
    "LANE": "LN",
    "LN": "LN",
    "PLACE": "PL",
    "PL": "PL",
    "TERRACE": "TER",
    "TER": "TER",
    "HIGHWAY": "HWY",
    "HWY": "HWY",
    "PARKWAY": "PKWY",
    "PKWY": "PKWY",
    "CIRCLE": "CIR",
    "CIR": "CIR",
    "WAY": "WAY",
    "ALLEY": "ALY",
    "ALY": "ALY",
    "SQUARE": "SQ",
    "SQ": "SQ",
}
_SUFFIX_VALUES = frozenset(_STREET_SUFFIXES.values())
_ORDINAL_RE = re.compile(r"^(\d+)(ST|ND|RD|TH)$")
_NON_ALNUM = re.compile(r"[^A-Z0-9\s]")
_SPACES = re.compile(r"\s+")


def normalize_sf_street_name(value: str | None) -> str | None:
    """Map a Nominatim / label road to the SF permit `streetname` form.

    Examples: ``Lombard Street`` → ``LOMBARD ST``, ``8th Street`` → ``08TH ST``.
    """
    if not value or not str(value).strip():
        return None
    text = str(value).split(",")[0].upper().replace(".", "")
    text = _SPACES.sub(" ", _NON_ALNUM.sub(" ", text)).strip()
    tokens = text.split()
    if tokens and tokens[0].isdigit():
        tokens = tokens[1:]
    if not tokens:
        return None
    last = tokens[-1]
    if last in _STREET_SUFFIXES:
        tokens[-1] = _STREET_SUFFIXES[last]
    first = tokens[0]
    ordinal = _ORDINAL_RE.match(first)
    if ordinal:
        tokens[0] = f"{int(ordinal.group(1)):02d}{ordinal.group(2)}"
    return " ".join(tokens)


def street_name_stem(value: str | None) -> str | None:
    normalized = normalize_sf_street_name(value)
    if not normalized:
        return None
    tokens = normalized.split()
    if len(tokens) > 1 and tokens[-1] in _SUFFIX_VALUES:
        return " ".join(tokens[:-1])
    return normalized


def street_names_match(left: str | None, right: str | None) -> bool:
    a = normalize_sf_street_name(left)
    b = normalize_sf_street_name(right)
    if not a or not b:
        return False
    if a == b:
        return True
    return street_name_stem(a) == street_name_stem(b)


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
