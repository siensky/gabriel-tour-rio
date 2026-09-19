import { notFound } from 'next/navigation'

import { HubTemplate } from '@/components/tour/HubTemplate'
import { TourTemplate } from '@/components/tour/TourTemplate'
import { tours, getTour } from '@/content/tours'
import { getDictionary, isLocale } from '@/lib/i18n'

/**
 * One dynamic route for every tour — hub or leaf. Next combines this with the
 * parent [locale] segment's generateStaticParams automatically, so this only
 * needs to declare the slugs; all 24 slugs get built under each locale.
 */
export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }))
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const tour = getTour(slug)
  if (!tour) notFound()

  const copy = tour.i18n[locale]
  if (!copy) notFound()

  const dict = await getDictionary(locale)

  return tour.hub ? (
    <HubTemplate tour={tour} copy={copy} locale={locale} dict={dict} />
  ) : (
    <TourTemplate tour={tour} copy={copy} locale={locale} dict={dict} />
  )
}
