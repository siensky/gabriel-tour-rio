import { Bricolage_Grotesque, Archivo } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import '@/app/globals.css'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { JsonLd } from '@/components/seo/JsonLd'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildTravelAgencySchema, buildWebSiteSchema } from '@/lib/seo'

/*
  Self-hosted at build time by next/font — no request to Google, no layout
  shift. Bricolage Grotesque for headings (distinctive, a bit odd, not the
  default-looking sans every AI-built site ships with); Archivo for body text.
*/
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const body = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

/** Pre-renders one static tree per language. */
export function generateStaticParams() {
  return localeParams()
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-sand"
        >
          {dict.nav.skipToContent}
        </a>

        {/* Site-wide entities — once per page, every page, so every crawl of
            the site sees the same TravelAgency/WebSite regardless of which
            page it enters on. Ties the site to the Google Business Profile
            via sameAs once that URL is filled in (see content/business.ts). */}
        <JsonLd data={[buildTravelAgencySchema(), buildWebSiteSchema()]} />

        <Header locale={locale} dict={dict} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer locale={locale} dict={dict} />

        {/* Mobile-only floating booking button. */}
        <WhatsAppButton
          variant="sticky"
          label={dict.cta.bookOnWhatsapp}
          message={dict.whatsapp.general}
        />
      </body>
    </html>
  )
}
