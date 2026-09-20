import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { RelatedTours } from '@/components/tour/RelatedTours'
import { TourFaq } from '@/components/tour/TourFaq'
import { TourHero } from '@/components/tour/TourHero'
import { TourHighlights } from '@/components/tour/TourHighlights'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHubTour, getToursByCategory, getChildTours } from '@/content/tours'
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPersonSchema,
  buildTouristTripSchema,
  buildVideoObjectSchema,
  type Crumb,
} from '@/lib/seo'
import type { Dictionary, Locale } from '@/types'
import type { Tour, TourCopy } from '@/types/tour'

/** Sibling tours under the same hub, or same-category tours if standalone. */
function relatedTours(tour: Tour): Tour[] {
  if (tour.parent) {
    const hub = getHubTour(tour.parent)
    const siblings = getChildTours(tour.parent).filter((t) => t.slug !== tour.slug)
    return hub ? [hub, ...siblings] : siblings
  }

  return getToursByCategory(tour.category)
    .filter((t) => t.slug !== tour.slug && !t.hub)
    .slice(0, 3)
}

export function TourTemplate({
  tour,
  copy,
  locale,
  dict,
}: {
  tour: Tour
  copy: TourCopy
  locale: Locale
  dict: Dictionary
}) {
  const hub = tour.parent ? getHubTour(tour.parent) : undefined
  const selfCrumb: Crumb = { href: `/${locale}/tours/${tour.slug}/`, label: copy.title }
  const trail: Crumb[] = [
    { href: `/${locale}/tours/`, label: dict.nav.tours },
    ...(hub
      ? [{ href: `/${locale}/tours/${hub.slug}/`, label: hub.i18n[locale]?.title ?? hub.slug }]
      : []),
    selfCrumb,
  ]

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema(locale, dict, trail),
          buildTouristTripSchema(tour, copy, locale),
          buildFaqSchema(copy.faq),
          buildVideoObjectSchema(tour, copy),
          // Ties this page's content to a real, named local guide — the
          // compact <AboutGabriel> byline below is its visible counterpart.
          buildPersonSchema(locale),
        ]}
      />

      <Breadcrumb locale={locale} dict={dict} trail={trail} />
      <TourHero tour={tour} copy={copy} dict={dict} />
      <TourHighlights copy={copy} dict={dict} />
      <TourFaq copy={copy} dict={dict} />
      <RelatedTours tours={relatedTours(tour)} locale={locale} dict={dict} />

      {/* Author byline — ties this page's content back to a real, named local
          guide (see the plan's "Nyckelkomponenter som återanvänds"). */}
      <AboutGabriel locale={locale} dict={dict} variant="compact" />
    </>
  )
}
