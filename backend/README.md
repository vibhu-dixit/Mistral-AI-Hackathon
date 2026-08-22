# Backend/API — Member 1 (Ibrahim)

FastAPI service for RoadWatch **image** analysis.

- `POST /analyze-image` — photo → Mistral → structured hazard → optional persist
- `POST /api/observations` — capture-client contract (EXIF GPS, then device GPS)
- Duplicate check against RoadWatch rows + SF311
- Civic report + SF311 category routing
- `GET /api/hazards` — list for the map workstream

Video is out of scope.

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -e ..\ai-service
uvicorn app.main:app --reload --port 8000
```

Repo-root `.env` must include:

```
MISTRAL_API_KEY=...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=...
```

Optional: `SUPABASE_SERVICE_ROLE_KEY` / `sb_secret_...` for writes that bypass RLS.

If you used the publishable key only, create the tables once in the Supabase SQL Editor (dashboard login is enough — no database password):

1. Open [SQL Editor](https://supabase.com/dashboard/project/yjwugyozhpfeqblnsolk/sql/new)
2. Paste `supabase/apply_all.sql` and Run

That file is `schema.sql` + `rls-writes.sql` + `backend/supabase/001_observations.sql`.

```powershell
.\.venv\Scripts\python.exe -m pytest tests
```

## Try it

```powershell
curl.exe -X POST http://127.0.0.1:8010/analyze-image -F "file=@C:\path\to\pothole.jpg" -F "latitude=37.775" -F "longitude=-122.413"
```

Open API docs at http://127.0.0.1:8010/docs

Agent loop (Ibrahim demo): http://127.0.0.1:8010/agent-loop

