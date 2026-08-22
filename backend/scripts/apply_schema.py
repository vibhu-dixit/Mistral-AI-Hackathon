from __future__ import annotations

import os
from pathlib import Path

import psycopg
from psycopg import ClientCursor

ROOT = Path(__file__).resolve().parents[2]
FILES = [
    ROOT / "supabase" / "schema.sql",
    ROOT / "supabase" / "rls-writes.sql",
    ROOT / "backend" / "supabase" / "001_observations.sql",
]


def main() -> None:
    password = os.environ.get("SUPABASE_DB_PASSWORD", "").strip()
    if not password:
        raise SystemExit("Set SUPABASE_DB_PASSWORD")
    conninfo = {
        "host": os.environ.get("SUPABASE_DB_HOST", "db.yjwugyozhpfeqblnsolk.supabase.co"),
        "port": int(os.environ.get("SUPABASE_DB_PORT", "5432")),
        "dbname": "postgres",
        "user": os.environ.get("SUPABASE_DB_USER", "postgres"),
        "password": password,
        "sslmode": "require",
    }
    with psycopg.connect(**conninfo, cursor_factory=ClientCursor, autocommit=True) as conn:
        for path in FILES:
            print("applying", path.name)
            conn.execute(path.read_text(encoding="utf-8"))
            print("ok", path.name)
    print("schema ready")


if __name__ == "__main__":
    main()
