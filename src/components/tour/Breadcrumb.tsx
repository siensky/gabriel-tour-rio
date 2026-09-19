import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import type { Dictionary, Locale } from '@/types'

type Crumb = { href: string; label: string }

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD (same trail,
 * machine-readable) is added in Fas 4 — this component is what it will read.
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
  const items: Crumb[] = [
    { href: `/${locale}/`, label: dict.common.backToHome },
    { href: `/${locale}/tours/`, label: dict.nav.tours },
    ...trail,
  ]

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
