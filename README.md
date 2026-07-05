# MBG Insight AI (PawonWarga-FE)

Next.js 16 (App Router, TypeScript, Tailwind v4) dashboard for monitoring public sentiment around Indonesia's MBG (Makan Bergizi Gratis) program. This is a UI-faithful port of the original Vite/React prototype (`../PawonWarga-FE-old`) onto Next.js conventions — see `AGENTS.md` for the architecture rationale.

It is currently a self-contained prototype: all data in `lib/data/dummy-data.ts` is mocked, there is no backend integration yet.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

## Commands

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
app/(dashboard)/   route group: layout (sidebar/topbar/mention modal) + one folder per page
components/layout/ AppShell, Sidebar, Topbar
components/ui/     Card, Badge, Modal, StatCard, WordCloud
components/mentions/ MentionDetailModal (consumes mention-context)
context/           MentionProvider / useMention()
lib/               types, mock data, business logic, formatters, PDF export
```

See `AGENTS.md` for details on routing, the Server/Client Component split, and the data layer.
