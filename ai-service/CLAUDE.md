# Agent context — AI/ML Integration (Mistral)

You're working on severity assessment from pothole photos and the
location → responsible-party mapping, exposed as `POST /analyze` (see
`../docs/API_CONTRACT.md`).

- The location → responsible-party mapping is the hard part of this whole
  project. Default to a lookup table (or GIS boundary data if available)
  rather than trying to get an LLM to reliably reason its way to a
  department name — treat AI reasoning as a fallback, not the primary path.
- This service can be built and tested standalone against sample photo
  URLs + coordinates — it doesn't need a live backend to develop against.
- Never commit a Mistral API key. Use `.env` (already gitignored at the
  repo root) and document required env vars in this folder's `README.md`.
- If the `/analyze` request/response shape needs to change, update
  `../docs/API_CONTRACT.md` in the same change — the backend calls this
  endpoint and builds against that file.
