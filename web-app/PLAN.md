# RoadWatch — Frontend Plan (Team Member 2 / Johnathon)

Planning doc only — nothing here is implemented yet. Scope is strictly the
**Frontend + Product Experience** workstream from the RoadWatch brief:
landing screen, upload + analysis progress, map, hazard detail, generated
report. Mistral prompts, the analysis API, OCR, duplicate-detection logic,
and SF311 integration belong to the AI/Backend lead — this frontend only
*calls* that API and renders what comes back.

> **Note on the existing repo scaffold:** this repo currently has separate
> `backend/` and `ai-service/` folders (from an earlier 4-way split). The
> RoadWatch brief combines AI + Backend into one owner (Ibrahim). That's a
> repo-structure question for the team to resolve, not something this plan
> changes — flagging it so it doesn't get missed, but it's out of scope
> here since it isn't "my part."

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Required by the brief; App Router gives file-based routing that maps 1:1 to the product's screens |
| Styling | Tailwind CSS | Fast to build a consistent, polished design system with; easy for teammates to read utility classes without hunting through separate CSS files |
| Map | **Mapbox GL JS** (`react-map-gl`), fallback to **Leaflet** (`react-leaflet`) if a Mapbox token becomes a blocker before demo day | Mapbox gives the closer-to-native, polished look the brief asks for; Leaflet needs zero API key and is a safe fallback |
| Data fetching / caching | TanStack Query | Wraps loading/error/retry state around every API call instead of hand-rolling `useState`/`useEffect` in every component — this is the main lever for "easy to debug" |
| Icons | `lucide-react` | Lightweight, consistent stroke icons, matches a minimal modern aesthetic |
| Font | Next.js built-in `Geist` (or `Inter` as a fallback) | Clean geometric sans-serif, close to what Mistral's own site uses |

---

## 2. Design system (Mistral-inspired)

I pulled the actual colors out of mistral.ai's shipped CSS rather than
eyeballing screenshots. Dominant brand colors, by frequency in their
stylesheet:

| Hex | Role on mistral.ai | Frequency |
|---|---|---|
| `#FA500F` | Primary brand orange (their signature "flame" color) | most common accent |
| `#FEC63A` | Warm amber/yellow (gradient partner to the orange) | 2nd most common |
| `#044298` | Deep navy (cool counterpoint accent) | 3rd most common |
| `#FF8204` | Secondary orange | — |
| `#933800` | Deep burnt orange/brown | — |
| `#151524` / `#121227` | Near-black (dark-mode base) | — |

**RoadWatch design tokens**, adapted from that palette (not a literal copy
of their logo — just the same warm/cool family so it reads as "in the same
universe" as Mistral's branding):

```
--rw-bg:            #FBFAF6   /* warm off-white page background */
--rw-surface:       #FFFFFF   /* cards */
--rw-border:        #E7E4DC   /* hairlines, card borders */
--rw-text:          #17171C   /* primary text, near-black not pure black */
--rw-text-muted:    #6B6A66

--rw-brand-start:   #FA500F   /* gradient start — primary CTAs, active nav, focus rings */
--rw-brand-end:     #FEC63A   /* gradient end */
--rw-accent-navy:   #044298   /* links, info states, secondary buttons */

--rw-severity-routine:  #FEC63A   /* reuses the amber stop */
--rw-severity-urgent:   #FF8204   /* orange */
--rw-severity-critical: #C4001D   /* red, pulled from mistral.ai's red family */

--rw-dark-bg:        #121227   /* stretch: dark mode background */
```

Tying severity color-coding to the same warm gradient the brand already
uses (yellow → orange → red as severity increases) means the palette does
double duty: it looks like Mistral's brand *and* the color ramp is
functionally meaningful (severity visually escalates), instead of being
arbitrary decoration.

**UI patterns:**
- Rounded-xl cards (`rounded-2xl`), soft shadows, generous padding/whitespace — matches the airy, uncluttered feel of mistral.ai.
- Primary CTA buttons use the orange→amber gradient (`bg-gradient-to-r`); everything else is a plain outlined or ghost button — one gradient element per screen max, so it stays a signal, not noise.
- Severity and status render as pill badges, not colored backgrounds on whole cards — keeps the UI calm even with a "critical" item in the list.
- Skeleton/empty-box loaders (plain gray `rounded-lg` blocks) everywhere an image or async value hasn't loaded yet — this is also literally the mock-data strategy, see §4.

---

## 3. Routes (Next.js App Router)

```
app/
├── layout.tsx                    Root layout: fonts, Tailwind, TanStack Query provider
├── globals.css                   Design tokens (§2) as CSS variables + Tailwind theme
├── page.tsx                      "/"            Landing screen
├── analyze/
│   └── page.tsx                  "/analyze"     Upload + analysis-progress screen
├── dashboard/
│   └── page.tsx                  "/dashboard"   Map + pins + filters (the public dashboard)
├── hazard/
│   └── [id]/
│       └── page.tsx              "/hazard/:id"  Full hazard detail (deep-linkable)
└── report/
    └── [id]/
        └── page.tsx              "/report/:id"  Generated report screen
```

Clicking a map pin on `/dashboard` opens the hazard detail **as a modal over
the map** (client-side state, not a route change) for the fast in-demo
click-through, but the modal's content is the *same* component tree as
`/hazard/[id]`, and the URL updates to `?hazard=<id>` via
`useSearchParams`/`router.replace` (shallow) so the state is shareable and
refresh-safe without a full navigation. This gives one component to build
and debug, reused in two contexts — no duplicated modal-vs-page logic to
keep in sync.

---

## 4. Component + folder structure

```
components/
├── ui/                      Design-system primitives, used everywhere
│   ├── Button.tsx           variant="primary" (gradient) | "secondary" | "ghost"
│   ├── Card.tsx
│   ├── Badge.tsx            for severity + status pills
│   ├── Modal.tsx
│   ├── ProgressStepper.tsx  the "Scanning frames... / Hazards detected..." sequence
│   └── ImagePlaceholder.tsx the gray empty-box shown whenever image_url is null/loading
│
├── landing/
│   ├── Hero.tsx
│   ├── ProblemSection.tsx   "seeing → identifying → categorizing → reporting → tracking"
│   └── HowItWorks.tsx       SEE → UNDERSTAND → LOCATE → CHECK → PRIORITIZE → ROUTE → ACT
│
├── upload/
│   ├── UploadDropzone.tsx   accepts image OR video, drag-and-drop + file picker
│   ├── MediaPreview.tsx
│   └── AnalysisProgress.tsx uses ProgressStepper + polls/streams status
│
├── map/
│   ├── MapCanvas.tsx        wraps Mapbox/Leaflet, purely presentational (hazards in, pin-click out)
│   ├── HazardPin.tsx        colored by severity
│   ├── MapFilters.tsx       hazard type / severity / status filter bar
│   └── MapLegend.tsx
│
├── hazard/
│   ├── HazardCard.tsx       compact list/card view
│   ├── HazardDetail.tsx     shared by the modal and /hazard/[id] page
│   ├── SeverityBadge.tsx
│   ├── StatusBadge.tsx
│   ├── ConfidenceMeter.tsx
│   └── AIReasoningBlock.tsx quotes the "why" text from the AI response
│
└── report/
    ├── GeneratedReportView.tsx
    └── ReportActions.tsx    "Submit Report" (simulated for the demo, see §6)
```

**Why this shape is easy to debug:**
- `ui/` never imports from any feature folder — one-directional dependency, so a bug in `map/` can never be "caused by" something in `report/`.
- Every feature component is presentational; data fetching lives only in `hooks/` (§5). If a screen shows wrong data, the bug is in exactly one hook, not scattered across components.
- `HazardDetail` is the single source of truth for how a hazard renders — the modal and the standalone page can't drift out of sync because they're the same component.

---

## 5. Data layer

### 5.1 Shared type (source of truth)

The team's shared JSON schema from the brief, expanded with the extra
fields the UI needs (image, location label, AI reasoning text, status,
timestamp). One file, imported everywhere — if the AI/Backend lead changes
a field name, TypeScript breaks the build at every call site instead of
failing silently at runtime.

`lib/types.ts`:

```ts
export type HazardType = "pothole" | "debris" | "blocked_lane" | "flooding";
export type Severity = "routine" | "urgent" | "critical";
export type HazardStatus =
  | "detected" | "report_ready" | "reported" | "in_progress" | "resolved";

export interface Hazard {
  id: string;
  hazard_type: HazardType;
  severity: Severity;
  confidence: number;          // 0–1
  latitude: number;
  longitude: number;
  location_label: string;      // e.g. "Folsom St & 8th St, San Francisco"
  description: string;         // the municipal-report-style summary
  ai_reasoning: string;        // "why" text shown in the detail view
  image_url: string | null;    // null -> ImagePlaceholder renders
  priority_score: number;      // 0–100
  duplicate: boolean;
  duplicate_distance_m?: number;
  target_category: string;     // e.g. "Street defect"
  generated_report: string;
  status: HazardStatus;
  detected_at: string;         // ISO 8601
}

export interface AnalyzeResponse {
  hazards: Hazard[];
  frame_count?: number;        // for video: how many frames were sampled
}
```

### 5.2 Mock/skeleton data

`lib/mock/hazards.ts` — 7–8 sample `Hazard` objects, hand-picked to exercise
every UI state at once:

- one of each of the 4 MVP categories (pothole, debris, blocked_lane, flooding)
- one of each severity (routine, urgent, critical)
- one with `duplicate: true` and a `duplicate_distance_m` (exercises the "possible duplicate" UI)
- one with `image_url: null` (exercises `ImagePlaceholder`)
- one of each status, including `"reported"` and `"resolved"` (exercises status filters/badges)

This is deliberately "skeleton data" — real field shapes, placeholder
content, empty gray boxes wherever an image would go — so every screen can
be built, styled, and demoed against it before the AI/Backend lead's real
`/analyze-image` endpoint exists.

`lib/mock/report.ts` — one sample generated-report string, matching the
brief's example ("Large pothole located in the westbound traffic lane…").

### 5.3 API client + mock/real toggle

`lib/api/client.ts` wraps two calls owned by the AI/Backend lead:

```
analyzeImage(file, coords?) -> POST /analyze-image -> AnalyzeResponse
analyzeVideo(file, coords?) -> POST /analyze-video -> AnalyzeResponse
listHazards(filters?)       -> GET  /hazards        -> Hazard[]
getHazard(id)                -> GET  /hazards/:id    -> Hazard
```

Every function checks `process.env.NEXT_PUBLIC_USE_MOCK_DATA`:
`"true"` returns the mock data from §5.2 (with an artificial delay to
simulate the progress screen), anything else calls the real endpoint at
`NEXT_PUBLIC_API_BASE_URL`. One flag, flipped in `.env.local`, switches the
entire app between "fully working demo on mock data" and "wired to the real
backend" — this is what makes the frontend demo-safe even if the backend
integration breaks right before presenting (acceptance criteria: "demo runs
reliably from beginning to end").

### 5.4 Hooks

`hooks/useHazards.ts`, `hooks/useHazard.ts`, `hooks/useAnalyzeUpload.ts` —
thin TanStack Query wrappers around the client functions above. Components
only ever call a hook, never `fetch`/the client directly — keeps loading,
error, and empty states consistent everywhere instead of reimplemented
per-screen.

---

## 6. Screen-by-screen plan

### Landing (`/`)
Hero with the north-star line ("Turn every camera into an autonomous road
inspector"), a one-line problem statement, the SEE→UNDERSTAND→…→ACT loop as
a horizontal step strip, and a primary CTA ("Analyze Drive") linking to
`/analyze`.

### Upload + analysis progress (`/analyze`)
1. `UploadDropzone` — accepts a single image or a short video.
2. On submit, calls `useAnalyzeUpload()`, which drives `AnalysisProgress`
   through the brief's exact status sequence: *Scanning frames… → Hazards
   detected… → Reading location context… → Checking existing reports… →
   Prioritizing…* — each step is a fixed-duration stage against mock data,
   or driven by real backend status if/when that exists.
3. On completion, route to `/dashboard?highlight=<hazardIds>` so the new
   pin(s) are visibly emphasized on arrival.

### Dashboard / map (`/dashboard`)
`MapCanvas` renders all hazards as `HazardPin`s colored by severity;
`MapFilters` for hazard type / severity / status (matches §14 of the
brief exactly). Clicking a pin opens `HazardDetail` in a modal (§3).

### Hazard detail (modal or `/hazard/[id]`)
Mirrors the brief's Issue Detail View 1:1: hazard type, location, severity
badge, confidence meter, detected timestamp, evidence image (or
`ImagePlaceholder`), `AIReasoningBlock`, and a link/button to the generated
report. "Possible duplicate found 11 meters away" banner when
`duplicate: true`.

### Generated report (`/report/[id]`)
Renders `generated_report` as the municipal-style paragraph, plus
`ReportActions` with a **Submit Report** button. Per the brief, submission
is simulated for the hackathon — clicking it just flips the hazard's status
client-side (optimistic update through the same hook) rather than calling a
real municipal system.

---

## 7. Build order

Matches the brief's P0/P1/P2 priorities, frontend slice only:

1. **Design system + types + mock data** (§2, §5.1, §5.2) — nothing else can start cleanly without this.
2. **Landing page** — cheapest screen, gets something on-screen fast.
3. **Dashboard/map + pins + filters** against mock data — this is the screen the whole demo revolves around (§14, Scene 4 of the brief).
4. **Hazard detail modal/page** against mock data.
5. **Generated report screen** against mock data.
6. **Upload + analysis progress** (image first, video second) — build last among the "core" screens since it's the most state-heavy (multi-step progress, file handling).
7. **Swap `NEXT_PUBLIC_USE_MOCK_DATA` to real endpoints** as the AI/Backend lead's `/analyze-image`, `/analyze-video`, `/hazards` come online — nothing else in the app should need to change, since components never talk to fetch directly (§5.4).
8. **Polish pass**: transitions, responsive/mobile layout, error and empty states, loading skeletons everywhere real data can be slow.

Steps 2–5 can all build entirely against mock data in parallel with
Ibrahim's backend work — nobody is blocked waiting on anybody else once
§5.1/§5.2 exist.

---

## 8. Explicitly out of scope for this plan

- Mistral prompt design, multimodal/OCR calls, severity reasoning, agent orchestration, duplicate-detection logic, SF311 integration → Ibrahim (AI/Backend).
- Market research, competitor analysis, pitch statistics → Member 3.
- Slide deck, demo footage, deployment, architecture diagram, submission materials → Member 4 (though the frontend should end up in a state that's trivially deployable to Vercel for Member 4 to point at).
- Backend-owned repo folders (`backend/`, `ai-service/`) — not touched by this plan.
