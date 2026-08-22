# Agent context — Dashboard/Data Viz

You're working on the public map interface, the prioritization algorithm
(severity + report count + time open), and status/filter UI. This is
read-heavy — it consumes `GET /api/reports` (see `../docs/API_CONTRACT.md`),
it does not write.

- Build against a mock list of `Report` objects (matching the contract) if
  the backend isn't ready — don't block on a live API.
- Prioritization: start with a simple weighted score (severity, report
  count, time since created) rather than over-engineering a ranking model
  for a hackathon demo.
- Stay inside this folder unless a change genuinely needs to touch the
  shared API contract — if so, flag it rather than editing silently.
- No stack is chosen yet. If the user hasn't specified one, ask before
  scaffolding (e.g. which map library) rather than guessing.
