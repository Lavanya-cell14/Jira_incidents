# Cognitive Ticket Resolution Engine (CTRE)

A dashboard for triaging and resolving Jira incident tickets — live ticket list with
pagination, priority breakdown stats, a detail view (AI analyses, comments,
recommendations, approval history), and a manual human-resolution workflow with
RAG/runbook suggestions.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS 3**.
UI primitives live in a local `shared-ui` component library.

> Migrated from a Vite + React SPA to Next.js. See [`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md)
> for the full route map, decisions, and follow-ups.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs type-checking) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |

## Configuration

Create a `.env` (git-ignored) with the backend base URL:

```bash
BACKEND_URL=https://api.theyellow.network/incident
```

- `BACKEND_URL` is **server-only** (used by `next.config.ts` rewrites), so it does **not**
  need a `NEXT_PUBLIC_` prefix. If unset, it falls back to the value baked into
  `next.config.ts`.
- The browser only ever calls same-origin `/jira/...` paths; `next.config.ts` rewrites
  `/jira/:path*` → `${BACKEND_URL}/jira/:path*`. This replaces the old Vite dev proxy and
  works in both dev and production.

> **Note:** Production builds bake the rewrite destination at build time, so set
> `BACKEND_URL` in the deployment environment and rebuild when it changes.

## How it works

- The browser talks only to the Next.js app over HTTPS.
- `/jira/*` requests are rewritten server-side to the incident backend
  (FastAPI container, served at `https://api.theyellow.network/incident`).
- Data fetching is client-side (`app/_components/Dashboard.tsx`) because the page is
  highly interactive: pagination, two stacked modals, a manual-resolution `POST`, a
  refresh action, and a fan-out "all pages" stats request driven by user state.

### Key endpoints used

| Method | Path (via rewrite) | Purpose |
|---|---|---|
| `GET` | `/jira/tickets?page=&page_size=` | Paginated ticket list + stats source |
| `POST` | `/jira/tickets/{key}/human-resolution` | Submit a manual resolution |

## Project structure

```
app/
  layout.tsx              # Root layout — metadata, viewport, globals.css
  page.tsx                # Index route (/) → renders Dashboard
  not-found.tsx           # 404
  globals.css             # Tailwind + global styles
  icon.png                # Favicon
  _components/
    Dashboard.tsx         # Main client dashboard (all ticket logic)
shared-ui/
  src/components/ui/       # Local UI library (Button, Card, Table, StatCard, …)
next.config.ts            # reactStrictMode, /jira rewrites → BACKEND_URL
tailwind.config.js
```

The `shared-ui` library is imported via the `shared-ui` path alias (see `tsconfig.json`).

## Deployment

Targets Vercel (default Next.js output). Ensure `BACKEND_URL` is set in the project's
environment variables. The backend it proxies to is served over HTTPS behind nginx on the
Lightsail host.
