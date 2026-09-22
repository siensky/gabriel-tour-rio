import { Inter, Caveat } from 'next/font/google'
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
  shift. Inter for both headings and body — one clean, modern typeface
  throughout rather than pairing two families, closer to how iOS itself
  uses a single system face (SF Pro) everywhere and varies weight/size
  instead. Caveat is a genuine handwriting face, used only for Gabriel's
  sign-off — a detail no AI-generated template site bothers with (see the
  plan's "Personliga detaljer som inte går att generera").
*/
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const signature = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
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
    <html lang={locale} className={`${inter.variable} ${signature.variable}`}>
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
