import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { faq } from '@/content/faq'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata, type Crumb } from '@/lib/seo'

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
    path: 'faq',
    title: dict.meta.faq.title,
    description: dict.meta.faq.description,
  })
}

/**
 * Site-wide FAQ (booking, languages, general safety) — distinct from the
 * per-tour FAQ blocks in TourFaq. Content lives in content/faq.ts, TODO
 * placeholder pending Gabriel's real answers, so the same array drives both
 * this page and its FAQPage schema and can never drift apart.
 */
export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)
  const items = faq[locale]
  const trail: Crumb[] = [{ href: `/${locale}/faq/`, label: dict.nav.faq }]

  return (
    <>
      <JsonLd data={[buildBreadcrumbSchema(locale, dict, trail), buildFaqSchema(items)]} />
      <Breadcrumb locale={locale} dict={dict} trail={trail} />

      <Section tone="sand" className="pt-10">
        <Container>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{dict.nav.faq}</h1>

          <div className="mt-8 max-w-3xl divide-y divide-sand-deep border-y border-sand-deep">
            {items.map((item, index) => (
              <details key={index} className="py-4">
                <summary className="cursor-pointer list-none font-semibold marker:content-none">
                  {item.question}
                </summary>
                <p className="mt-2 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
