import Link from 'next/link'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { business } from '@/content/business'
import type { Dictionary, Locale } from '@/types'

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}/tours/`, label: dict.nav.tours },
    { href: `/${locale}/about/`, label: dict.nav.about },
    { href: `/${locale}/#custom-tours`, label: dict.nav.customTours },
    { href: `/${locale}/faq/`, label: dict.nav.faq },
    { href: `/${locale}/contact/`, label: dict.nav.contact },
  ]

  return (
    // No hard border — a soft shadow plus a stronger, more transparent blur
    // reads as a floating glass bar rather than a flat strip with a ruled
    // line under it (the "cheap navbar" look).
    <header className="sticky top-0 z-40 bg-sand/75 shadow-[0_1px_12px_rgba(26,26,26,0.06)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={`/${locale}/`}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          {/* alt="": decorative here — the text right next to it already
              names the business, so a screen reader shouldn't announce it twice. */}
          {/* rounded-full: the source image is a seal on a white square —
              clipping it to a circle removes the square corners without
              needing actual image transparency. */}
          <Picture
            src="gabriel-tour-logo"
            alt=""
            className="h-10 w-10 shrink-0 rounded-full"
            sizes="40px"
          />
          {/* Two-tone wordmark: "Gabriel Tour" in ink, "Rio" in the brand
              green — the business name is one string in content/business.ts,
              so it's split on the last word rather than hardcoding "Rio"
              here twice. */}
          <span>
            {business.name.slice(0, business.name.lastIndexOf(' '))}{' '}
            {/* text-forest, not text-whatsapp(-dark) — the WhatsApp greens
                are tuned as button fills, not as small text; forest is the
                site's other green and clears 4.5:1 on this background
                (9.05:1) where whatsapp-dark only reaches 2.59:1. */}
            <span className="text-forest">
              {business.name.slice(business.name.lastIndexOf(' ') + 1)}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Always visible, including on mobile — the old row of four
              codes was desktop-only, leaving phone visitors with no way to
              switch language at all. */}
          <LanguageSwitcher current={locale} dict={dict} />

          {/* Booking is never more than one tap away. */}
          <div className="hidden sm:block">
            <WhatsAppButton
              variant="nav"
              label={dict.cta.bookOnWhatsapp}
              message={dict.whatsapp.general}
            />
          </div>

          <MobileMenu links={links} dict={dict} />
        </div>
      </Container>
    </header>
  )
}
