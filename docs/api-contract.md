# API Contract — PawonWarga-FE ↔ PawonWarga-BE

The frontend already calls every endpoint listed here. Until they exist, each call is served
by a local mock built from `lib/data/dummy-data.ts` (see [Mock mode](#mock-mode)).

Implementing the endpoints below is enough to switch the whole dashboard onto the real
backend — no page or hook changes required.

## Conventions

**Base URL** — `NEXT_PUBLIC_API_URL`, default `http://localhost:8080/api/v1`.

**Envelope** — every response uses the same wrapper `/auth/*` already uses:

```json
{ "success": true, "message": "OK", "data": { }, "error": null }
```

`lib/api-client.ts` unwraps `data` and throws `ApiError(message, status)` when
`success` is false or the HTTP status is not 2xx.

**Auth** — `Authorization: Bearer <token>` is sent whenever a session exists. Endpoints below
are expected to require it; the FE tolerates anonymous access while mock mode is on.

**Field naming** — snake_case on the wire, matching the existing `phone_number` /
`profile_picture` convention. `lib/api/mappers.ts` converts to the camelCase shapes the UI
uses, and is the only file that needs editing if a field is named differently.

**Sentiment values** — `"positive" | "negative" | "neutral"` everywhere.

---

## GET /dashboard/overview

Backs `/dashboard`. Query: `range` (optional, e.g. `this_month`).

```json
{
  "headline": {
    "positive_share": "72.4%",
    "total_conversations": "128,430",
    "description": "Based on 128,430 public conversations about the MBG program."
  },
  "summary": {
    "total_mentions": { "value": "128,430", "change": "▲ 18.2%" },
    "positive":       { "value": "72.4%",   "change": "▲ 6.8%" },
    "negative":       { "value": "18.7%",   "change": "▼ 3.2%" },
    "neutral":        { "value": "8.9%",    "change": "▲ 1.1%" }
  },
  "trend": [{ "day": "1 Mei", "positive": 68, "neutral": 32, "negative": 18 }],
  "topic_distribution": [{ "name": "Food Quality", "value": 28, "color": "#064e3b" }],
  "topic_total": "128,430",
  "keyword_cloud": [{ "text": "makan bergizi", "value": 64 }],
  "recent_mentions": [ /* Mention, see below */ ],
  "drivers": [
    { "name": "Manfaat gizi anak", "value": "42.1K", "tone": "positive", "label": "Positive", "progress": 92 }
  ],
  "data_sources": [
    { "code": "X", "label": "X / Twitter", "value": "45.2K", "active": true }
  ],
  "last_updated": "15 menit yang lalu"
}
```

Notes:
- `value` / `change` are **display strings** — the FE renders them verbatim, including the
  `▲`/`▼` prefix. Formatting is the backend's call.
- `color` in `topic_distribution` is a hex string owned by the backend so the donut and its
  legend always agree.
- `progress` is 0-100 and drives the driver bar width.
- `code` in `data_sources` maps to a badge style in the page (`X`, `IG`, `TT`, `N`, `YT`);
  unknown codes fall back to a neutral badge.

## GET /mentions

Backs `/monitoring`. Query: `q`, `platform`, `sentiment`, `page`, `per_page`.

`platform` is either a platform name or `All Platforms`; `sentiment` is a sentiment value or
`All Sentiments`. Both mean "no filter".

```json
{
  "items": [
    {
      "id": 1,
      "platform": "X",
      "user": "@publicvoice",
      "text": "Program MBG membantu anak sekolah...",
      "sentiment": "positive",
      "engagement": "12.4K",
      "time": "10:24",
      "location": "Jawa Barat",
      "category": "Nutrition",
      "risk": "Low"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 6, "total_pages": 1 },
  "metrics": {
    "live_mentions": 6,
    "total_engagement": 34000,
    "unique_authors": 6,
    "flagged_issues": 2
  },
  "platform_volume": [
    { "name": "X", "value": 45200, "positive": 62, "negative": 22, "neutral": 16, "mention_count": null }
  ],
  "total_unfiltered": 6,
  "platforms": ["X", "Instagram", "TikTok", "News", "YouTube"]
}
```

Notes:
- `metrics` and `platform_volume` must aggregate the **whole filtered set**, not just the
  current page — the stat cards would be wrong otherwise.
- `risk` is `"Low" | "Medium" | "High"`.
- `mention_count` is `null` when no filter narrowed the set.
- `total_unfiltered` feeds the "Showing X of Y" label.

## GET /mentions/{id}

Single mention, same object as an `items` entry. Not used by a page yet — wired for the
detail modal to fetch on demand instead of relying on list state.

## GET /sentiment/overview

Backs `/sentiment`. Query: `range` (optional).

```json
{
  "score": 81,
  "score_max": 100,
  "description": "Public sentiment remains healthy...",
  "summary": {
    "positive": { "value": "72.4%", "change": "▲ 6.8%" },
    "negative": { "value": "18.7%", "change": "▼ 3.2%" },
    "neutral":  { "value": "8.9%",  "change": "▲ 1.1%" },
    "analyzed": { "value": "128K",  "change": "▲ 18.2%" }
  },
  "distribution": [{ "name": "Positive", "value": 72.4, "color": "#67c74a" }],
  "trend": [{ "day": "1 Mei", "positive": 68, "neutral": 32, "negative": 18 }],
  "trend_insights": [
    { "label": "Peak positive", "value": "82%", "desc": "Highest positive sentiment this month", "tone": "positive" }
  ],
  "by_platform": [
    { "name": "X", "value": 45200, "positive": 62, "negative": 22, "neutral": 16 }
  ],
  "by_category": [{ "category": "Food Quality", "positive": 42, "negative": 39, "neutral": 19 }],
  "category_note": "Positive sentiment is strongest in nutrition..."
}
```

`trend_insights[].tone` is `"positive" | "neutral" | "info"` (a badge colour, not a sentiment).

## GET /sentiment/locations

Regional breakdown. Query: `range`. No page consumes it yet — the service
(`getSentimentLocations`) and hook (`useSentimentLocations`) exist so the map/region view can
be added without new plumbing.

```json
[{ "name": "Jawa Barat", "score": 82, "sentiment": "positive", "mentions": "24.5K" }]
```

## GET /keywords

Backs `/keywords`. Query: `q`, `sentiment` (`All Sentiments` means no filter).

```json
{
  "items": [
    { "text": "makan bergizi", "value": 64, "sentiment": "positive", "growth": "+18%", "mentions": "42.1K" }
  ],
  "stats": { "tracked": 12, "rising": 5, "negative": 3, "volume": 245000 },
  "alerts": [
    { "title": "distribusi", "desc": "Percakapan negatif naik 24% dalam periode monitoring terakhir." }
  ]
}
```

`stats.volume` is a raw number (the FE formats it with `id-ID` compact notation); `value` drives
the word-cloud font size.

The FE debounces the `q` field by 350 ms, so expect one request per pause, not per keystroke.

## GET /ai/insight

Backs `/ai`.

```json
{
  "score": 81,
  "score_note": "Skor gabungan dari sentimen, reach, issue velocity, dan stabilitas percakapan.",
  "confidence": 92,
  "headline": "MBG sentiment remains positive.",
  "summary": "Percakapan publik tentang program MBG...",
  "findings": ["Sentimen positif didorong oleh narasi gizi anak..."],
  "recommendations": ["Publikasikan ringkasan standar kualitas makanan..."],
  "stats": {
    "confidence":         { "value": "92%", "change": "Stable" },
    "generated_insights": { "value": "48",  "change": "▲ 12" },
    "detected_issues":    { "value": "7",   "change": "▲ 3" },
    "resolved_signals":   { "value": "21",  "change": "▲ 8" }
  }
}
```

## GET /reports

Backs the `/reports` table and stat cards.

```json
{
  "items": [
    {
      "id": "RPT-001",
      "title": "Executive Summary MBG Mei 2025",
      "type": "Executive Summary",
      "status": "Ready",
      "date": "31 Mei 2025",
      "pages": 18
    }
  ],
  "stats": {
    "total":     { "value": "4",    "change": "Dummy data" },
    "scheduled": { "value": "1",    "change": "Stable" },
    "downloads": { "value": "1.2K", "change": "▲ 19%" },
    "shared":    { "value": "186",  "change": "▲ 12%" }
  }
}
```

`status` is `"Ready" | "Scheduled" | "Draft"`. The page recomputes Total/Scheduled from the
list as the user generates previews, so only `stats.*.change` and the Downloads/Shared values
are read straight from the response.

## GET /reports/templates

```json
[
  {
    "id": "executive-brief",
    "name": "Executive Brief",
    "best_for": "Pimpinan / stakeholder",
    "tone": "Strategis",
    "layout": "1 halaman ringkasan + rekomendasi",
    "sections": ["Executive Snapshot", "Public Trust Score"]
  }
]
```

The first template in the array becomes the page's default selection.

## POST /reports/generate

Builds a report document. The FE calls this once on page load to render the initial preview,
and again on every "Generate Preview" / "New Preview" click.

Request:

```json
{
  "type": "Executive Summary",
  "date_range": "1 - 31 Mei 2025",
  "format": "PDF",
  "template_id": "executive-brief"
}
```

Response (`ReportDocument`):

```json
{
  "id": "RPT-D1234",
  "title": "Executive Summary - 1 - 31 Mei 2025",
  "type": "Executive Summary",
  "status": "Draft",
  "date": "Generated now",
  "pages": 18,
  "format": "PDF",
  "template": { "id": "executive-brief", "name": "Executive Brief", "best_for": "...", "tone": "...", "layout": "...", "sections": [] },
  "highlights": ["72.4% sentimen publik berada di area positif."],
  "prepared_for": "MBG Insight Team",
  "period": "1 - 31 Mei 2025",
  "metrics": [{ "label": "Positive Sentiment", "value": "72.4%" }],
  "sections": [{ "title": "Executive Snapshot", "body": "...", "bullets": ["..."] }],
  "appendix": ["Data pada prototype ini menggunakan dummy conversations."]
}
```

Because it is called on page load, this should be safe to invoke repeatedly — generate and
return the document without persisting a new record, or make persistence idempotent per
(type, date_range, template_id).

## GET /reports/{id}

Same `ReportDocument` shape, for reopening a saved report.

## GET /reports/{id}/download

Registered in `lib/api/endpoints.ts` but not called yet — PDF export is still built in the
browser by `lib/pdf-export.ts`. Expected to return the binary with the right
`Content-Type`/`Content-Disposition` when server-side export lands.

## GET /settings/integrations

```json
[{ "name": "X / Twitter", "status": "Operational", "count": "45.2K mentions" }]
```

`status` is `"Operational" | "Not Operational"`.

## PATCH /settings/integrations/{name}

Flips one integration. Returns the **full updated list** (same shape as the GET) so the page
can replace its state in one go. The name is URL-encoded — `X / Twitter` arrives as
`X%20%2F%20Twitter`. Switch to a stable slug/id if that is awkward on the Go side; only
`endpoints.settings.integration()` and the page's `toggleIntegration` would change.

## GET /settings/preferences

```json
[
  {
    "key": "negativeAlert",
    "title": "Negative sentiment alert",
    "desc": "Notify when negative sentiment rises above threshold.",
    "checked": true
  }
]
```

These are per-user monitoring toggles. `title` and `desc` come from the backend so copy can
change without a redeploy.

## PUT /settings/preferences

Request `{ "key": "negativeAlert", "checked": false }`, returns the full updated list.

The FE toggles optimistically and rolls back if the call fails.

---

## Mock mode

`NEXT_PUBLIC_USE_MOCK_API` (default `true`) decides where each service gets its DTO:

- `true` — built locally in `lib/api/mock/*.mock.ts` from `lib/data/dummy-data.ts` and
  `lib/business-logic.ts`, resolved after `NEXT_PUBLIC_MOCK_LATENCY_MS` (default 250 ms).
- `false` — fetched via `apiFetch` from `NEXT_PUBLIC_API_URL`.

Both paths return the same snake_case DTO and run through the same mapper, so the mapping is
already exercised before the backend exists.

Auth (`/auth/*`) is **not** mocked — it always hits the real backend through
`lib/auth-api.ts`.

## Switching to the real backend

1. Implement the endpoints above.
2. Set in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   NEXT_PUBLIC_USE_MOCK_API=false
   ```
3. Restart the dev server. No page, hook, or component changes needed.

Endpoints can be migrated one at a time by leaving mock mode on and hardcoding
`USE_MOCK_API` to `false` inside a single service in `lib/api/`.

## Where things live

| File | Role |
| --- | --- |
| `lib/api/config.ts` | Base URL, mock flag, mock latency, default page size |
| `lib/api/endpoints.ts` | Path registry — the list above in code form |
| `lib/api/types.ts` | Wire DTOs (`*Dto`) and the app-facing shapes |
| `lib/api/mappers.ts` | snake_case → camelCase, the single point of contract drift |
| `lib/api/http.ts` | Query-string builder, mock latency helper |
| `lib/api/<feature>.ts` | One service per feature; picks mock vs `apiFetch`, then maps |
| `lib/api/mock/*.mock.ts` | Mock DTO builders — delete once the backend is live |
| `hooks/use-api-query.ts` | `{ data, error, isLoading, isFetching, refetch }` |
| `hooks/use-api-mutation.ts` | `{ mutate, isPending, error, reset }` |
| `hooks/use-<feature>.ts` | Per-feature hooks; inject the auth token |
