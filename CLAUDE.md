# Repo orientation for AI agents

This is a hackathon project with four independent workstreams, each in its
own top-level folder. Each folder has its own `CLAUDE.md` with scoped
context — if you're working inside `mobile-app/`, `backend/`, `ai-service/`,
or `dashboard/`, read that folder's `CLAUDE.md` first, it takes precedence
over this one for anything specific to that area.

- `docs/API_CONTRACT.md` — the shared data model and endpoint shapes every
  workstream builds against. Treat this as the source of truth for how the
  pieces talk to each other. If it's out of date relative to real code,
  update it rather than letting it drift.
- `mobile-app/` — photo capture, GPS/EXIF tagging, submission + tracking UI.
- `backend/` — report ingestion, DB schema, routing/integration glue. Owns
  the data model.
- `ai-service/` — Mistral-based severity assessment and location →
  responsible-party mapping.
- `dashboard/` — public map, prioritization, status/filter UI.

## Ground rules

- Don't make changes outside the current folder's scope without flagging it
  — this repo has multiple people working in parallel, each in their own
  folder.
- No tech stack is locked in at the repo level; each workstream owner picks
  their own within their folder. Don't assume a stack that isn't already
  present in the folder you're working in.
- When in doubt about a request/response shape, check
  `docs/API_CONTRACT.md` before inventing one.
