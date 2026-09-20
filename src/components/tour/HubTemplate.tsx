import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { TourCard } from '@/components/tour/TourCard'
import { TourHero } from '@/components/tour/TourHero'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { getChildTours } from '@/content/tours'
import { buildBreadcrumbSchema, buildPersonSchema, type Crumb } from '@/lib/seo'
import type { Dictionary, Locale } from '@/types'
import type { Tour, TourCopy } from '@/types/tour'

/**
 * Renders a cluster hub (favela-tours, hiking-rio-de-janeiro): the page that
 * owns the generic high-volume search term, linking down to each specific
 * tour so the individual pages don't cannibalise each other's ranking — see
 * the plan's "hub-and-spoke" section.
 *
 * No TouristTrip/Offer schema here — a hub lists several tours, it isn't
 * itself a single bookable product.
 */
export function HubTemplate({
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
  const children = getChildTours(tour.slug)
  const trail: Crumb[] = [
    { href: `/${locale}/tours/`, label: dict.nav.tours },
    { href: `/${locale}/tours/${tour.slug}/`, label: copy.title },
  ]

  return (
    <>
      <JsonLd data={[buildBreadcrumbSchema(locale, dict, trail), buildPersonSchema(locale)]} />

      <Breadcrumb locale={locale} dict={dict} trail={trail} />
      <TourHero tour={tour} copy={copy} dict={dict} />

      <Section tone="sandDeep">
        <Container>
          {copy.body.map((paragraph, index) => (
            <p key={index} className="mb-4 max-w-3xl text-ink-soft">
              {paragraph}
            </p>
          ))}
        </Container>
      </Section>

      <Section tone="sandDeep">
        <Container>
          <h2 className="text-2xl sm:text-3xl">{dict.tours.title}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <TourCard key={child.slug} tour={child} locale={locale} dict={dict} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Author byline — see TourTemplate for the same pattern. */}
      <AboutGabriel locale={locale} dict={dict} variant="compact" />
    </>
  )
}
