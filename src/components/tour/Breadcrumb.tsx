import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { buildBreadcrumbTrail, type Crumb } from '@/lib/seo'
import type { Dictionary, Locale } from '@/types'

/**
 * Visible breadcrumb trail. `trail` is everything after Home — callers
 * supply their own full path (e.g. tour pages include a "Tours" crumb
 * themselves; /about does not), since not every page sits under /tours.
 *
 * Uses the same buildBreadcrumbTrail as buildBreadcrumbSchema (lib/seo.ts),
 * so the visible trail and the BreadcrumbList JSON-LD can never disagree.
 */
export function Breadcrumb({
  locale,
  dict,
  trail,
}: {
  locale: Locale
  dict: Dictionary
  trail: Crumb[]
}) {
  const items = buildBreadcrumbTrail(locale, dict, trail)

  return (
    <nav aria-label="Breadcrumb" className="border-b border-sand-deep">
      <Container>
        <ol className="flex flex-wrap items-center gap-1 py-3 text-xs text-ink-soft">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="text-sand-deep">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  )
}
