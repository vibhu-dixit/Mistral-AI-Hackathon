import io

import pillow_heif
import pytest
from PIL import Image

from app import geolocation
from mistral_pipeline.geo import extract_exif_gps
from mistral_pipeline.images import prepare_jpeg

pillow_heif.register_heif_opener()


def _heic_with_gps(lat_dms, lat_ref, lng_dms, lng_ref) -> bytes:
    img = Image.new("RGB", (16, 16), color=(120, 40, 200))
    exif = img.getexif()
    exif[34853] = {1: lat_ref, 2: lat_dms, 3: lng_ref, 4: lng_dms}
    buf = io.BytesIO()
    img.save(buf, format="HEIF", exif=exif)
    return buf.getvalue()


# 37°48'5"N, 122°28'40"W ~= (37.8014, -122.4778)
GOLDEN_GATE_HEIC = _heic_with_gps((37.0, 48.0, 5.0), "N", (122.0, 28.0, 40.0), "W")


def test_prepare_jpeg_converts_heic_to_real_jpeg() -> None:
    jpeg_bytes, data_uri = prepare_jpeg(GOLDEN_GATE_HEIC)
    assert jpeg_bytes[:2] == b"\xff\xd8"  # JPEG magic bytes
    assert data_uri.startswith("data:image/jpeg;base64,")


def test_mistral_pipeline_extracts_gps_from_heic() -> None:
    lat, lng = extract_exif_gps(GOLDEN_GATE_HEIC)
    assert lat == pytest.approx(37.8014, abs=1e-3)
    assert lng == pytest.approx(-122.4778, abs=1e-3)


def test_backend_geolocation_extracts_gps_from_heic() -> None:
    coords = geolocation.extract_exif_coordinates(GOLDEN_GATE_HEIC)
    assert coords is not None
    assert coords.latitude == pytest.approx(37.8014, abs=1e-3)
    assert coords.longitude == pytest.approx(-122.4778, abs=1e-3)


def test_backend_geolocation_still_works_on_plain_jpeg_with_gps() -> None:
    img = Image.new("RGB", (16, 16), color=(10, 10, 10))
    exif = img.getexif()
    exif[34853] = {1: "N", 2: (37.0, 48.0, 5.0), 3: "W", 4: (122.0, 28.0, 40.0)}
    buf = io.BytesIO()
    img.save(buf, format="JPEG", exif=exif)

    coords = geolocation.extract_exif_coordinates(buf.getvalue())
    assert coords is not None
    assert coords.latitude == pytest.approx(37.8014, abs=1e-3)
