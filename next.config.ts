import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export: every page is pre-rendered to plain HTML at build time.
  // No server, no API routes — the whole site is uploaded as files.
  output: 'export',

  // Directory-style URLs (/en/tours/ instead of /en/tours.html) so canonical
  // URLs and hreflang stay clean.
  trailingSlash: true,

  // next/image optimisation needs a server, which static export has none of.
  // Images are pre-optimised at build time by scripts/optimize-images.mjs.
  images: { unoptimized: true },
}

export default nextConfig
