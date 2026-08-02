# MBG Insight AI (PawonWarga-FE)

Next.js 16 (App Router, TypeScript, Tailwind v4) dashboard for monitoring public sentiment around Indonesia's MBG (Makan Bergizi Gratis) program. This is a UI-faithful port of the original Vite/React prototype (`../mbg-sentiment-insight-ai-fe`) onto Next.js conventions.

It's a hybrid prototype, not a pure mock:

- **Auth is real.** Login, register, profile, avatar upload, password change, and logout-all-devices go through an actual backend (`PawonWarga-BE`) via `lib/api-client.ts` / `lib/auth-api.ts`.
- **Everything else is mocked — but already goes through the API layer.** Dashboard metrics, social monitoring, sentiment analysis, keywords, AI summary, reports, and the settings panels are fetched through typed services in `lib/api/` and React hooks in `hooks/`. While `NEXT_PUBLIC_USE_MOCK_API` is `true`, those services build their response locally from `lib/data/dummy-data.ts`; flip it to `false` and the exact same calls hit `PawonWarga-BE`.

The endpoints the backend needs to implement are specified in [`docs/api-contract.md`](docs/api-contract.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

`/dashboard`, `/monitoring`, `/sentiment`, `/keywords`, `/reports`, and `/settings` (view-only parts) work with no backend running. `/login` and `/register` need `PawonWarga-BE` reachable at `NEXT_PUBLIC_API_URL` (see below) to actually succeed.

## Environment variables

| Variable | Default | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | Base URL of `PawonWarga-BE`, used by every API call |
| `NEXT_PUBLIC_USE_MOCK_API` | `true` | When `true`, non-auth data is served from local mocks instead of the backend. Set to `false` once the endpoints in `docs/api-contract.md` exist |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `250` | Simulated round-trip for mock responses, so loading states stay honest |

## Commands

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

There is no test suite configured yet.

## Project structure

```
app/                    "/" redirects to /dashboard; login/register are public routes
app/(dashboard)/        route group: layout (auth guard + sidebar/topbar/mention modal) + one folder per page
                         (dashboard, monitoring, sentiment, keywords, ai, reports, settings)
components/layout/      AppShell, Sidebar, Topbar
components/ui/          Card, Badge, Modal, StatCard, WordCloud, LogoMark
components/auth/        AuthField, AuthLayout (shared shell for /login and /register)
components/mentions/    MentionDetailModal (consumes mention-context)
context/                AuthProvider / useAuth(), MentionProvider / useMention()
hooks/                  useApiQuery / useApiMutation + one query hook per feature
lib/api/                endpoint registry, wire DTOs, mappers, one service per feature, mocks
lib/                    types, dummy data, business logic, formatters, API client, PDF export
types/                  ambient module declarations (d3-cloud)
docs/api-contract.md    the REST contract PawonWarga-BE needs to implement
```

### How a page gets its data

```
page.tsx  →  hooks/use-<feature>.ts  →  lib/api/<feature>.ts  →  ┬ mock builder (lib/api/mock/)
                                                                 └ apiFetch → PawonWarga-BE
                                          ↓
                                     lib/api/mappers.ts (snake_case → camelCase)
```

Both branches return the same DTO and run through the same mapper, so the mapping is already
exercised before the backend exists. Pages never import `lib/data/dummy-data.ts` directly.

See `CLAUDE.md` (local, not committed) for the full architecture rationale, current-state caveats, and conventions used when extending this codebase.
