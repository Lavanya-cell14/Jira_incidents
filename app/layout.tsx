import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

// Replaces the <title> from the old index.html. Favicon is served automatically
// from app/icon.png (the former src/assets/tyn-logo.png).
export const metadata: Metadata = {
  title: 'CTRE',
};

// Preserves the original index.html viewport exactly:
// <meta name="viewport" content="width=device-width, initial-scale=0.5" />
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
