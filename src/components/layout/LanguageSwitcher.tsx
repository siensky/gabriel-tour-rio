'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LOCALES, LOCALE_NAMES } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

/**
 * Swaps the locale segment of the current path, so the visitor stays on the
 * page they were reading.
 *
 * These are ordinary links, not client-side state: each language is its own
 * crawlable URL, which is what hreflang needs anyway.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname()

  const pathFor = (locale: Locale) => {
    const segments = pathname.split('/').filter(Boolean)
    segments[0] = locale // first segment is always the locale
    return `/${segments.join('/')}/`.replace(/\/+$/, '/')
  }

  return (
    <nav aria-label="Language" className="flex items-center gap-1">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={pathFor(locale)}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? 'true' : undefined}
          aria-label={LOCALE_NAMES[locale]}
          title={LOCALE_NAMES[locale]}
          className={cn(
            'rounded px-2 py-1 text-xs font-semibold uppercase transition-colors',
            locale === current
              ? 'bg-ink text-sand'
              : 'text-ink-soft hover:bg-sand-deep hover:text-ink',
          )}
        >
          {locale}
        </Link>
      ))}
    </nav>
  )
}
