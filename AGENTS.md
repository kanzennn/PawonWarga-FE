<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Next.js 16 (App Router, TypeScript, Tailwind v4) port of the "MBG Insight AI" sentiment dashboard. This replaces the old Vite/React SPA that lived at `../PawonWarga-FE-old` (kept as a reference, no longer developed). UI is a 1:1 visual port — same Tailwind classes, same copy, same layout — rebuilt on Next.js conventions instead of client-side state switching.

**Still a self-contained prototype: not wired to any backend.** All data comes from `lib/data/dummy-data.ts`. Treat "connect to the real API" as new work, not a config fix.

## Commands

```bash
npm install
npm run dev     # next dev (Turbopack, default since Next 16)
npm run build   # next build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint-config-next)
```

No test runner is configured.

## Architecture

### Routing replaces the old state-switch pattern

The old app kept one `activePage` string in React state and swapped which page component rendered. Here each sidebar entry is a real route under the `(dashboard)` route group: `/dashboard`, `/monitoring`, `/sentiment`, `/keywords`, `/ai`, `/reports`, `/settings`. `app/page.tsx` redirects `/` to `/dashboard`. `app/(dashboard)/layout.tsx` wraps every route in `AppShell` (sidebar + topbar) so navigation only re-renders the page content, not the shell.

`components/layout/Sidebar.tsx` is a Client Component that reads the active route via `usePathname()` and renders `next/link` — there is no more `activePage`/`setActivePage` prop pair to thread through.

To add a page: create `app/(dashboard)/<route>/page.tsx`, then add a matching entry to the `menus` array in `Sidebar.tsx`.

### Mention modal uses Context, not prop drilling

The old app lifted `selectedMention` state to the top-level `App.jsx` and passed `onSelectMention` down as a prop, because everything rendered in one component tree. That doesn't work across route boundaries in the App Router, so `context/mention-context.tsx` (`MentionProvider` / `useMention()`) replaces it. `app/(dashboard)/layout.tsx` mounts the provider and `<MentionDetailModal />` once; any page calls `useMention().selectMention(item)` to open it.

### Server vs Client Components

Only components that actually need hooks, browser APIs, or Recharts/`d3-cloud` are marked `"use client"`: `Sidebar`, `AppShell`, `WordCloud`, `MentionDetailModal`, the mention context, and every page except `ai/page.tsx`. `ai/page.tsx` has no interactivity — it just calls the pure `generateExecutiveInsight()` — so it stays a Server Component. Keep new read-only pages server-rendered by default; only add `"use client"` when the page actually needs state, effects, or a client-only library.

`components/ui/*` (`Card`, `Badge`, `StatCard`, `Modal`) have no directive and no hooks — they're plain presentational components that get bundled into whichever boundary imports them.

### Data and business-logic layers (`lib/`)

Ported from the old `src/data` and `src/utils` almost line-for-line, now typed against `lib/types.ts`:

- `lib/data/dummy-data.ts` — the mock arrays (mentions, keywords, trends, reports, etc.). Swap this out first when wiring a real API.
- `lib/business-logic.ts` — pure filter/aggregate/generate functions consumed by pages (`filterMentions`, `keywordStats`, `generateReportDocument`, etc.). Pages call these instead of transforming data inline.
- `lib/formatters.ts` — small display formatters.
- `lib/pdf-export.ts` — hand-rolled PDF byte-stream builder (no PDF library dependency), used by the Reports page's client-side "Download PDF" button. Extend this file rather than introducing a PDF library, or raise it as a decision first.

### Sentiment color convention

`components/ui/Badge.tsx` maps a `tone` prop (`positive` / `negative` / `neutral` / `danger`) to fixed Tailwind classes — the single source of truth for sentiment coloring. `StatCard` has its own separate `StatTone` (`positive` / `danger` / `neutral` / `info`) for its icon/trend styling; don't conflate the two.

### Styling

Tailwind v4, configured via `@theme` in `app/globals.css` (no `tailwind.config.js` — that file doesn't exist in v4 by default). Font is Inter via `next/font/google`, wired to `--font-sans` in `app/layout.tsx`/`globals.css`, matching the old app's Tailwind `fontFamily.sans` override. Components still use the old app's inline arbitrary-hex Tailwind values (e.g. `bg-[#0d321e]`) — match that style rather than introducing new design tokens.

### Images

`next.config.ts` allowlists `i.pravatar.cc` via `images.remotePatterns` so `Topbar.tsx` can use `next/image` for the avatar instead of a raw `<img>`. Add new remote hosts there before using `next/image` with them.
