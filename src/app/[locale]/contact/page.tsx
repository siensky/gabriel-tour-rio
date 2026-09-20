import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { JsonLd } from '@/components/seo/JsonLd'
import { business } from '@/content/business'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildBreadcrumbSchema, buildMetadata, type Crumb } from '@/lib/seo'

export function generateStaticParams() {
  return localeParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const dict = await getDictionary(locale)
  return buildMetadata({
    locale,
    path: 'contact',
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  })
}

/**
 * No embedded Google Map here on purpose — an iframe embed sets Google's own
 * cookies, which would force the cookie-consent banner the whole analytics
 * setup was chosen specifically to avoid (see the plan's "Statistik" section).
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)
  const trail: Crumb[] = [{ href: `/${locale}/contact/`, label: dict.nav.contact }]

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(locale, dict, trail)} />
      <Breadcrumb locale={locale} dict={dict} trail={trail} />

      <Section tone="sand" className="pt-10">
        <Container>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{dict.nav.contact}</h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            {`TODO (${locale}): short intro — booking happens on WhatsApp, this page just gets you there.`}
          </p>

          <div className="mt-8">
            <WhatsAppButton
              variant="hero"
              label={dict.cta.messageGabriel}
              message={dict.whatsapp.general}
            />
          </div>

          <dl className="mt-10 space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              <dt className="sr-only">WhatsApp</dt>
              <dd>{business.phoneDisplay}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Instagram</dt>
              <dd>
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {business.instagramHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">{dict.tours.title}</dt>
              <dd>{business.areaServed}</dd>
            </div>
          </dl>
        </Container>
      </Section>
    </>
  )
}
