import type { NextConfig } from 'next';

// Server-only backend URL. The browser calls /jira/* and Next rewrites it.
const backendUrl = process.env.BACKEND_URL ?? 'https://api.theyellow.network/incident';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.1.46.146', '127.0.0.1'],
  outputFileTracingRoot: import.meta.dirname,
  experimental: {
    devtoolSegmentExplorer: false,
  },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: '/jira/:path*',
        destination: `${backendUrl}/jira/:path*`,
      },
    ];
  },
};

export default nextConfig;
