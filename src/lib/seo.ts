import type { Metadata } from 'next'

import { business, SITE_URL } from '@/content/business'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'
import type { Dictionary, Locale } from '@/types'
import type { FaqItem, Tour, TourCopy } from '@/types/tour'

// ---------------------------------------------------------------------------
// URLs & hreflang
// ---------------------------------------------------------------------------

/**
 * Builds an absolute, trailing-slash URL for a locale-agnostic path, e.g.
 * absoluteUrl('pt', 'tours/rocinha-favela-tour') →
 * "https://gabrieltourrio.com/pt/tours/rocinha-favela-tour/"
 *
 * Matches next.config.ts's `trailingSlash: true`, so this is always the
 * exact URL the static export actually serves — never handwritten elsewhere.
 */
export function absoluteUrl(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `${SITE_URL}/${locale}/${clean}/` : `${SITE_URL}/${locale}/`
}

/**
 * Canonical + hreflang alternates for a page.
 *
 * `availableLocales` defaults to all four. Pass a narrower list for content
 * that isn't translated yet (e.g. an English-only Rio Guide article in
 * Fas 7), so hreflang never points at a URL that doesn't exist — the most
 * common hreflang bug (see the plan's Verifiering section).
 */
export function buildAlternates(
  locale: Locale,
  path: string,
  availableLocales: readonly Locale[] = LOCALES,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const l of availableLocales) languages[l] = absoluteUrl(l, path)
  languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path)

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  }
}

const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  pt: 'pt_BR',
}

/**
 * Builds a page's full Metadata object. Title and description always come
 * from the caller's own content (copy.metaTitle for tours, dict.meta.<page>
 * for static pages) and are used verbatim — no title template is applied
 * here, so every page's title fits its own ≤60-character budget exactly as
 * written, in every language, instead of a fixed suffix eating into it
 * unpredictably per translation.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  availableLocales,
}: {
  locale: Locale
  path: string
  title: string
  description: string
  availableLocales?: readonly Locale[]
}): Metadata {
  const alternates = buildAlternates(locale, path, availableLocales)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: business.name,
      locale: OG_LOCALES[locale],
      type: 'website',
      // TODO: og:image — added in Fas 5 once real photos exist. Pointing at a
      // PlaceholderImage (a CSS gradient, not a file) would just 404 when
      // Facebook/Twitter's scrapers fetch it, so no image beats a broken one.
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

// ---------------------------------------------------------------------------
// Breadcrumbs — shared by the visible <Breadcrumb> component and
// buildBreadcrumbSchema below, so the two can never list different things.
// ---------------------------------------------------------------------------

export type Crumb = { href: string; label: string }

export function buildBreadcrumbTrail(locale: Locale, dict: Dictionary, trail: Crumb[]): Crumb[] {
  return [{ href: `/${locale}/`, label: dict.common.backToHome }, ...trail]
}

// ---------------------------------------------------------------------------
// JSON-LD — structured data
// ---------------------------------------------------------------------------

type JsonLdObject = Record<string, unknown>

export function buildBreadcrumbSchema(locale: Locale, dict: Dictionary, trail: Crumb[]): JsonLdObject {
  const items = buildBreadcrumbTrail(locale, dict, trail)

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  }
}

/**
 * Once per site (see [locale]/layout.tsx). `sameAs` is the technical link
 * between the site and the Google Business Profile / Instagram — see the
 * plan's "SEO-implementation" table.
 */
export function buildTravelAgencySchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: business.name,
    url: SITE_URL,
    telephone: `+${business.phone}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.areaServed,
    // TODO: business.googleBusinessProfile is still null (pending approval —
    // see content/business.ts) so sameAs is Instagram-only for now; it picks
    // up the GBP URL automatically once that field is filled in.
    sameAs: [business.instagram, business.googleBusinessProfile].filter(
      (url): url is string => url !== null,
    ),
  }
}

export function buildWebSiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: business.name,
    url: SITE_URL,
  }
}

/**
 * Gabriel himself — the E-E-A-T anchor (see the plan's "Gabriels
 * positionering"). Reused as the primary entity on /about and, once guide
 * articles exist (Fas 7), as their `author`.
 */
export function buildPersonSchema(locale: Locale): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: business.legalName,
    jobTitle: 'Local tour guide',
    url: absoluteUrl(locale, 'about'),
    worksFor: { '@type': 'TravelAgency', name: business.name, url: SITE_URL },
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rio de Janeiro',
        addressCountry: 'BR',
      },
    },
    knowsAbout: ['Rio de Janeiro', 'Brazilian culture', 'Favela tourism', 'Hiking in Rio de Janeiro'],
    knowsLanguage: business.languages,
  }
}

export function buildFaqSchema(items: FaqItem[]): JsonLdObject | null {
  if (items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/**
 * Leaf tours only — a hub page (favela-tours, hiking-rio-de-janeiro) lists
 * several tours, it isn't itself a single bookable product.
 *
 * `offers` is omitted entirely — not emitted with a null price — until a
 * real price exists. An Offer with no price reads as broken structured data
 * to Google, the same "no fabricated data" rule as aggregateRating.
 */
export function buildTouristTripSchema(tour: Tour, copy: TourCopy, locale: Locale): JsonLdObject {
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: copy.title,
    description: copy.metaDescription,
    provider: { '@type': 'TravelAgency', name: business.name, url: SITE_URL },
  }

  if (tour.durationHours !== null) {
    schema.duration = `PT${tour.durationHours}H` // ISO 8601 duration
  }

  if (tour.priceFromBRL !== null) {
    schema.offers = {
      '@type': 'Offer',
      price: tour.priceFromBRL,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(locale, `tours/${tour.slug}`),
    }
  }

  return schema
}

/**
 * Video thumbnail eligibility in search results — one of the largest CTR
 * levers available (see the plan's "Extra hävstänger"). Only ever called
 * when both fields are set; no tour has a video yet, so this currently never
 * renders, but the pipe is ready for when one does.
 */
export function buildVideoObjectSchema(tour: Tour, copy: TourCopy): JsonLdObject | null {
  if (!tour.youtubeId || !tour.videoUploadDate) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: copy.title,
    description: copy.metaDescription,
    thumbnailUrl: [`https://i.ytimg.com/vi/${tour.youtubeId}/maxresdefault.jpg`],
    uploadDate: tour.videoUploadDate,
    embedUrl: `https://www.youtube.com/embed/${tour.youtubeId}`,
  }
}
