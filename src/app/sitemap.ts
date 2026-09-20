import type { MetadataRoute } from 'next'

import { tours } from '@/content/tours'
import { LOCALES } from '@/lib/i18n'
import { absoluteUrl, buildAlternates } from '@/lib/seo'

// Required for `output: 'export'` — without it, Next tries to generate this
// route dynamically at request time, which a static export has no server for.
export const dynamic = 'force-static'

/** The five static routes under every [locale] segment, plus every tour slug. */
const STATIC_PATHS = ['', 'tours', 'about', 'faq', 'contact']

/**
 * Generates /sitemap.xml at build time, with hreflang alternates on every
 * entry — no path is ever handwritten here, so the count can never silently
 * drift out of sync with content/tours.ts (see scripts/verify-build.ts,
 * which checks the same thing on the built output).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...tours.map((tour) => `tours/${tour.slug}`)]

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, path),
      alternates: { languages: buildAlternates(locale, path).languages },
    })),
  )
}
