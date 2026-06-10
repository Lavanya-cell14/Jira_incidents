// Index route (`/`). Mirrors the old src/App.tsx, which rendered <Dashboard/>.
// This stays a Server Component; Dashboard is the client boundary.
import Dashboard from './_components/Dashboard';

export default function Page() {
  return <Dashboard />;
}
