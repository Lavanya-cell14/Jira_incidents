# Cognitive Ticket Resolution Engine

A Next.js dashboard for viewing, triaging, and resolving Jira incident tickets.
The app shows live paginated ticket data, summary stats, priority breakdowns,
ticket detail modals, RAG/runbook suggestions, and a manual human-resolution
workflow.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 3
- lucide-react icons
- Local `shared-ui` TSX component library

This project was migrated from a Vite + React SPA to Next.js. See
[`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md) for migration details.

## Quick Start

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run TypeScript with `tsc --noEmit` |
| `npm run lint` | Run Next.js linting |

## Environment

The Next.js app uses a server-side rewrite for backend API traffic. Configure
the backend base URL with:

```env
BACKEND_URL=https://api.theyellow.network/incident
```

Important notes:

- `BACKEND_URL` is server-only and does not need `NEXT_PUBLIC_`.
- Browser code calls same-origin `/jira/...` URLs.
- `next.config.ts` rewrites `/jira/:path*` to `${BACKEND_URL}/jira/:path*`.
- `VITE_BACKEND_URL` is from the old Vite setup and is no longer used by this
  Next.js app.
- If `BACKEND_URL` is not set, `next.config.ts` falls back to
  `https://api.theyellow.network/incident`.
- Restart the dev server after changing environment variables.

Example local `.env`:

```env
BACKEND_URL=http://3.111.213.97/incident
```

## App Flow

1. The root route `/` renders `app/page.tsx`.
2. `app/page.tsx` loads `app/_components/Dashboard.tsx`.
3. `Dashboard.tsx` is a client component because it manages pagination, refresh,
   modal state, manual form state, and API calls.
4. The browser requests `/jira/tickets` and `/jira/tickets/{key}/human-resolution`.
5. Next.js rewrites those requests to the configured incident backend.

## API Paths Used

| Method | Frontend path | Purpose |
| --- | --- | --- |
| `GET` | `/jira/tickets?page=&page_size=` | Fetch paginated Jira tickets |
| `POST` | `/jira/tickets/{key}/human-resolution` | Submit a manual ticket resolution |

## Project Structure

```text
app/
  layout.tsx              Root layout, metadata, viewport, global styles
  page.tsx                Home route; renders Dashboard
  not-found.tsx           404 route
  globals.css             Tailwind and app-level styles
  icon.png                App icon
  _components/
    Dashboard.tsx         Main interactive ticket dashboard

shared-ui/
  src/
    index.ts              Shared UI exports
    components/ui/        Button, Card, Badge, Table, StatCard, and other UI primitives

next.config.ts            Next.js config and /jira rewrites
tailwind.config.js        Tailwind content paths and theme extension
tsconfig.json             TypeScript config and shared-ui path alias
postcss.config.js         Tailwind/PostCSS config
```

## Shared UI

The `shared-ui` folder contains reusable TSX components used by the dashboard.
It is imported through the `shared-ui` path alias configured in `tsconfig.json`.

Tailwind scans both the Next.js app and the shared UI package:

```js
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./shared-ui/src/**/*.{js,ts,jsx,tsx}",
]
```

## Deployment

This app targets standard Next.js hosting such as Vercel.

Before deploying:

1. Set `BACKEND_URL` in the deployment environment.
2. Run `npm run build`.
3. Deploy the generated Next.js app.

Because the rewrite destination is read by `next.config.ts`, rebuild the app
when changing `BACKEND_URL` in production.
