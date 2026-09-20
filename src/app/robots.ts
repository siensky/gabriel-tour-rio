import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/content/business'

// Required for `output: 'export'` — see sitemap.ts for the same note.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
