'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { LOCALES, LOCALE_NAMES } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Dictionary, Locale } from '@/types'

/**
 * A small dropdown in place of the old row of four language codes — one
 * tap target instead of four, and it now shows on mobile too (the previous
 * version was `hidden sm:block`, leaving phone visitors with no way to
 * switch language at all).
 *
 * The options are still ordinary <Link>s, not JS-only navigation: each
 * language is its own crawlable URL, which is what hreflang needs anyway.
 *
 * `tone="dark"` is for the footer's bg-forest background — see the plan's
 * Fas 5 Lighthouse verification for why the light-mode colours alone are
 * unreadable there.
 */
export function LanguageSwitcher({
  current,
  dict,
  tone = 'light',
}: {
  current: Locale
  dict: Dictionary
  tone?: 'light' | 'dark'
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const pathFor = (locale: Locale) => {
    const segments = pathname.split('/').filter(Boolean)
    segments[0] = locale // first segment is always the locale
    return `/${segments.join('/')}/`.replace(/\/+$/, '/')
  }

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const dark = tone === 'dark'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        // Must start with the visible text ("PT") for WCAG 2.5.3 (Label in
        // Name) — "Português" doesn't itself start with "Pt", so the code
        // is prefixed explicitly rather than relying on the language name
        // to happen to start with it (see the plan's Fas 5 fix for the
        // same bug in the previous row-of-links version).
        aria-label={`${current.toUpperCase()} — ${dict.nav.language}: ${LOCALE_NAMES[current]}`}
        className={cn(
          'flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold uppercase transition-colors',
          dark
            ? 'text-sand/70 hover:bg-sand/10 hover:text-sand'
            : 'text-ink-soft hover:bg-sand-deep hover:text-ink',
        )}
      >
        {current}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Real links, not an ARIA listbox — these navigate to a different
          page, they don't select a value within this one, so a simple
          toggled panel (same pattern as MobileMenu) fits better than the
          full listbox/option roving-focus pattern. */}
      <ul
        hidden={!open}
        aria-label={dict.nav.language}
        className={cn(
          'absolute right-0 top-full z-50 mt-1 min-w-36 overflow-hidden rounded-card border shadow-lg',
          dark ? 'border-sand/20 bg-forest' : 'border-sand-deep bg-sand',
        )}
      >
        {LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              href={pathFor(locale)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'flex min-h-11 items-center px-4 text-sm transition-colors',
                locale === current && 'font-semibold',
                dark
                  ? 'text-sand hover:bg-sand/10'
                  : 'text-ink hover:bg-sand-deep',
              )}
            >
              {LOCALE_NAMES[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
