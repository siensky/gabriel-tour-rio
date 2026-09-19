import type { ReactNode } from 'react'

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
