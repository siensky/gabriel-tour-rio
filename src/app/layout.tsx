import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SITE_URL } from '@/content/business'

/**
 * metadataBase resolves any relative URL used elsewhere in the metadata tree
 * (e.g. a future og:image path) against the real site origin — set once,
 * here, rather than on every page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
}

/**
 * Pass-through root layout.
 *
 * The real <html> element lives in [locale]/layout.tsx, because the `lang`
 * attribute has to carry the actual language of the page — search engines and
 * screen readers both rely on it, and this level doesn't know the locale yet.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
