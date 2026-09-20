import Link from 'next/link'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Container } from '@/components/ui/Container'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { business } from '@/content/business'
import { whatsappUrl } from '@/lib/whatsapp'
import type { Dictionary, Locale } from '@/types'

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-forest text-sand">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">{business.name}</p>
            <p className="mt-2 max-w-xs text-sm text-sand/80">{dict.footer.tagline}</p>
          </div>

          <nav aria-label={dict.footer.explore}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sand/70">
              {dict.footer.explore}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/tours/`} className="hover:underline">
                  {dict.nav.tours}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about/`} className="hover:underline">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq/`} className="hover:underline">
                  {dict.nav.faq}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact/`} className="hover:underline">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sand/70">
              {dict.footer.getInTouch}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={whatsappUrl(dict.whatsapp.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {business.instagramHandle}
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <LanguageSwitcher current={locale} tone="dark" />
            </div>
          </div>
        </div>

        {/* sand/60 measured 4.37:1 on bg-forest — just under WCAG AA's 4.5:1. */}
        <p className="mt-12 border-t border-sand/20 pt-6 text-xs text-sand/70">
          &copy; {new Date().getFullYear()} {business.legalName}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  )
}
