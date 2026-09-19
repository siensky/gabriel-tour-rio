import Link from 'next/link'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { business } from '@/content/business'
import type { Dictionary, Locale } from '@/types'

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}/tours/`, label: dict.nav.tours },
    { href: `/${locale}/about/`, label: dict.nav.about },
    { href: `/${locale}/faq/`, label: dict.nav.faq },
    { href: `/${locale}/contact/`, label: dict.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-sand-deep bg-sand/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}/`} className="font-display text-lg font-bold tracking-tight">
          {business.name}
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
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} />
          </div>

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
