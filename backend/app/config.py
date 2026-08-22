from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


@lru_cache(maxsize=1)
def supabase_url() -> str:
    return env("SUPABASE_URL") or env("NEXT_PUBLIC_SUPABASE_URL")


@lru_cache(maxsize=1)
def supabase_key() -> str:
    return (
        env("SUPABASE_SERVICE_ROLE_KEY")
        or env("SUPABASE_SECRET_KEY")
        or env("SUPABASE_ANON_KEY")
        or env("SUPABASE_PUBLISHABLE_KEY")
        or env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )
