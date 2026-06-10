import type { NextConfig } from 'next';

// Backend base URL (server-only — NOT exposed to the client, so no NEXT_PUBLIC_
// prefix). Replaces the old Vite `server.proxy['/jira']` + VITE_BACKEND_URL.
// Fallback keeps `next build` working without a local .env.
const backendUrl = process.env.BACKEND_URL ?? 'https://api.theyellow.network/incident';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project — a stray lockfile exists one level up
  // (D:\TYN\package-lock.json), which otherwise makes Next infer the wrong root.
  outputFileTracingRoot: import.meta.dirname,
  // ESLint stays available via `npm run lint`, but is excluded from `next build`
  // so lint tooling can never block the production build / type-check pipeline.
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        // Mirrors the old Vite dev proxy: /jira/* -> <backend>/jira/*.
        // Works in BOTH dev and prod (the original Vite app only proxied in dev).
        source: '/jira/:path*',
        destination: `${backendUrl}/jira/:path*`,
      },
    ];
  },
};

export default nextConfig;
