// Basic 404. No equivalent existed in the original SPA (single route only).
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 text-slate-900">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-sm font-medium text-slate-500">This page could not be found.</p>
    </div>
  );
}
