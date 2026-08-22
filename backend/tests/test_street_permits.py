from mistral_pipeline.geo import normalize_sf_street_name, street_names_match
from mistral_pipeline.schemas import StreetPermitMatch

from app.street_permits import lookup_street_permit


def test_normalize_lombard_and_numbered_streets() -> None:
    assert normalize_sf_street_name("Lombard Street") == "LOMBARD ST"
    assert normalize_sf_street_name("100 Lombard Street, Russian Hill") == "LOMBARD ST"
    assert normalize_sf_street_name("8th Street") == "08TH ST"
    assert normalize_sf_street_name("1st Avenue") == "01ST AVE"
    assert street_names_match("Lombard Street", "LOMBARD ST")
    assert street_names_match("8th St", "08TH ST")
    assert not street_names_match("Lombard Street", "CHESTNUT ST")


def test_lookup_prefers_matching_street_over_closer_neighbor(monkeypatch) -> None:
    rows = [
        {
            "permit_number": "NEAR-CHESTNUT",
            "streetname": "CHESTNUT ST",
            "agent": "Wrong Contractor",
            "agentphone": "415-000-0000",
            "status": "ACTIVE",
            "permit_start_date": "2025-01-01T00:00:00.000",
            "permit_end_date": "2027-01-01T00:00:00.000",
            "latitude": "37.8021",
            "longitude": "-122.4187",
        },
        {
            "permit_number": "26EXC-02187",
            "streetname": "LOMBARD ST",
            "agent": "Esquivel Grading & Paving, Inc.",
            "agentphone": "415-468 5700",
            "status": "APPROVED",
            "permit_start_date": "2025-01-01T00:00:00.000",
            "permit_end_date": "2027-01-01T00:00:00.000",
            "latitude": "37.8006",
            "longitude": "-122.4294",
        },
    ]

    def fake_fetch(params: dict[str, str]) -> list:
        where = params.get("$where", "")
        if "within_circle" in where:
            return rows
        if "LOMBARD" in where:
            return [rows[1]]
        return []

    monkeypatch.setattr("app.street_permits._fetch", fake_fetch)

    match = lookup_street_permit(37.8021, -122.4187, street_name="Lombard Street")
    assert isinstance(match, StreetPermitMatch)
    assert match.agent == "Esquivel Grading & Paving, Inc."
    assert match.agent_phone == "415-468 5700"
    assert match.street_name == "LOMBARD ST"
    assert match.street_match is True


def test_lookup_falls_back_to_street_query_when_spatial_misses(monkeypatch) -> None:
    def fake_fetch(params: dict[str, str]) -> list:
        where = params.get("$where", "")
        if "within_circle" in where:
            return []
        if "LOMBARD ST" in where:
            return [
                {
                    "permit_number": "26EXC-02187",
                    "streetname": "LOMBARD ST",
                    "agent": "Esquivel Grading & Paving, Inc.",
                    "agentphone": "415-468 5700",
                    "status": "APPROVED",
                    "latitude": "37.8006",
                    "longitude": "-122.4294",
                }
            ]
        return []

    monkeypatch.setattr("app.street_permits._fetch", fake_fetch)
    match = lookup_street_permit(37.8021, -122.4187, street_name="Lombard Street")
    assert match is not None
    assert match.agent == "Esquivel Grading & Paving, Inc."
    assert match.agent_phone == "415-468 5700"


def test_lookup_returns_none_when_dataset_empty(monkeypatch) -> None:
    monkeypatch.setattr("app.street_permits._fetch", lambda params: [])
    assert lookup_street_permit(37.77, -122.41, street_name="Nowhere St") is None
