import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { CategoryFilter } from '@/components/tour/CategoryFilter'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { tours } from '@/content/tours'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildBreadcrumbSchema, buildMetadata, type Crumb } from '@/lib/seo'
import type { TourCategory } from '@/types/tour'

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
    path: 'tours',
    title: dict.meta.tours.title,
    description: dict.meta.tours.description,
  })
}

/** Categories that actually have a tour, in the order they should appear. */
const CATEGORY_ORDER: TourCategory[] = [
  'city',
  'favela',
  'hiking',
  'beach',
  'water',
  'nightlife',
  'transfer',
]

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)
  const present = CATEGORY_ORDER.filter((category) =>
    tours.some((tour) => tour.category === category),
  )
  const sorted = [...tours].sort((a, b) => a.order - b.order)
  const trail: Crumb[] = [{ href: `/${locale}/tours/`, label: dict.nav.tours }]

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(locale, dict, trail)} />
      <Breadcrumb locale={locale} dict={dict} trail={trail} />

      <Section tone="sand" className="pt-10">
        <Container>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{dict.tours.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">{dict.tours.subtitle}</p>

          <div className="mt-10">
            <CategoryFilter tours={sorted} categories={present} locale={locale} dict={dict} />
          </div>
        </Container>
      </Section>
    </>
  )
}
