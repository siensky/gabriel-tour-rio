import { describe, expect, it } from 'vitest'

import { business, SITE_URL } from '@/content/business'
import { getTour } from '@/content/tours'
import { LOCALES } from '@/lib/i18n'
import {
  absoluteUrl,
  buildAlternates,
  buildBreadcrumbSchema,
  buildBreadcrumbTrail,
  buildFaqSchema,
  buildMetadata,
  buildPersonSchema,
  buildTouristTripSchema,
  buildTravelAgencySchema,
  buildVideoObjectSchema,
  buildWebSiteSchema,
} from '@/lib/seo'
import en from '@/dictionaries/en.json'

describe('absoluteUrl', () => {
  it('builds a trailing-slash URL for a sub-path', () => {
    expect(absoluteUrl('en', 'tours/rocinha-favela-tour')).toBe(
      `${SITE_URL}/en/tours/rocinha-favela-tour/`,
    )
  })

  it('handles the home path (empty string) without a double slash', () => {
    expect(absoluteUrl('pt', '')).toBe(`${SITE_URL}/pt/`)
  })

  it('trims leading and trailing slashes from the input path', () => {
    expect(absoluteUrl('en', '/tours/')).toBe(`${SITE_URL}/en/tours/`)
  })
})

describe('buildAlternates', () => {
  it('includes all four locales plus x-default, defaulting to every locale', () => {
    const { languages } = buildAlternates('fr', 'about')
    expect(Object.keys(languages).sort()).toEqual(['en', 'es', 'fr', 'pt', 'x-default'].sort())
  })

  it('x-default always points at the English URL', () => {
    const { languages } = buildAlternates('pt', 'tours')
    expect(languages['x-default']).toBe(languages.en)
  })

  it('canonical matches the URL for the current locale', () => {
    const { canonical } = buildAlternates('es', 'faq')
    expect(canonical).toBe(absoluteUrl('es', 'faq'))
  })

  it('honours a narrower availableLocales list — the Fas 7 guide-page case', () => {
    const { languages } = buildAlternates('en', 'rio-guide/is-rio-safe', ['en'])
    expect(Object.keys(languages).sort()).toEqual(['en', 'x-default'])
  })
})

describe('buildMetadata', () => {
  it('uses the given title and description verbatim, with no template applied', () => {
    const metadata = buildMetadata({
      locale: 'en',
      path: 'tours/rocinha-favela-tour',
      title: 'Exact Title',
      description: 'Exact description.',
    })
    expect(metadata.title).toBe('Exact Title')
    expect(metadata.description).toBe('Exact description.')
  })

  it('does not set an openGraph image — none exists until Fas 5', () => {
    const metadata = buildMetadata({ locale: 'en', path: '', title: 't', description: 'd' })
    expect(metadata.openGraph).not.toHaveProperty('images')
  })

  it('maps each locale to a full BCP-47-ish og:locale', () => {
    const pt = buildMetadata({ locale: 'pt', path: '', title: 't', description: 'd' })
    expect(pt.openGraph?.locale).toBe('pt_BR')
  })
})

describe('buildBreadcrumbTrail', () => {
  it('always prepends Home, and only Home — no hardcoded Tours segment', () => {
    const trail = buildBreadcrumbTrail('en', en, [{ href: '/en/about/', label: 'About' }])
    expect(trail).toEqual([
      { href: '/en/', label: en.common.backToHome },
      { href: '/en/about/', label: 'About' },
    ])
  })
})

describe('buildBreadcrumbSchema', () => {
  it('numbers items from 1 and resolves each href to an absolute URL', () => {
    const schema = buildBreadcrumbSchema('en', en, [{ href: '/en/tours/', label: 'Tours' }]) as {
      itemListElement: { position: number; item: string }[]
    }
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, item: `${SITE_URL}/en/` })
    expect(schema.itemListElement[1]).toMatchObject({
      position: 2,
      item: `${SITE_URL}/en/tours/`,
    })
  })
})

describe('buildTravelAgencySchema', () => {
  it('omits the Google Business Profile from sameAs while it is still null', () => {
    const schema = buildTravelAgencySchema() as { sameAs: string[] }
    expect(business.googleBusinessProfile).toBeNull()
    expect(schema.sameAs).toEqual([business.instagram])
  })

  it('carries the exact phone number from content/business.ts', () => {
    const schema = buildTravelAgencySchema() as { telephone: string }
    expect(schema.telephone).toBe(`+${business.phone}`)
  })
})

describe('buildWebSiteSchema', () => {
  it('names the site and points at the real origin', () => {
    expect(buildWebSiteSchema()).toMatchObject({ '@type': 'WebSite', url: SITE_URL })
  })
})

describe('buildPersonSchema', () => {
  it('is Gabriel, and links to the /about page in the given locale', () => {
    const schema = buildPersonSchema('fr') as { name: string; url: string }
    expect(schema.name).toBe(business.legalName)
    expect(schema.url).toBe(absoluteUrl('fr', 'about'))
  })
})

describe('buildFaqSchema', () => {
  it('maps question/answer pairs into schema.org Question/Answer nodes', () => {
    const schema = buildFaqSchema([{ question: 'Q?', answer: 'A.' }]) as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[]
    }
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Q?',
      acceptedAnswer: { '@type': 'Answer', text: 'A.' },
    })
  })

  it('returns null for an empty list rather than an empty FAQPage', () => {
    expect(buildFaqSchema([])).toBeNull()
  })
})

describe('buildTouristTripSchema', () => {
  const tour = getTour('christ-the-redeemer-tour')!
  const copy = tour.i18n.en!

  it('never fabricates an Offer when there is no real price', () => {
    expect(tour.priceFromBRL).toBeNull()
    const schema = buildTouristTripSchema(tour, copy, 'en')
    expect(schema).not.toHaveProperty('offers')
  })

  it('includes an Offer, in BRL, once a price exists', () => {
    const pricedTour = { ...tour, priceFromBRL: 450 }
    const schema = buildTouristTripSchema(pricedTour, copy, 'en') as {
      offers: { price: number; priceCurrency: string }
    }
    expect(schema.offers).toMatchObject({ price: 450, priceCurrency: 'BRL' })
  })

  it('encodes duration as an ISO 8601 duration string', () => {
    const timedTour = { ...tour, durationHours: 4 }
    const schema = buildTouristTripSchema(timedTour, copy, 'en') as { duration: string }
    expect(schema.duration).toBe('PT4H')
  })
})

describe('buildVideoObjectSchema', () => {
  const tour = getTour('christ-the-redeemer-tour')!
  const copy = tour.i18n.en!

  it('returns null when no tour has a video yet', () => {
    expect(tour.youtubeId).toBeNull()
    expect(buildVideoObjectSchema(tour, copy)).toBeNull()
  })

  it('builds a full VideoObject once both youtubeId and videoUploadDate are set', () => {
    const videoTour = { ...tour, youtubeId: 'abc123', videoUploadDate: '2026-06-01' }
    const schema = buildVideoObjectSchema(videoTour, copy) as {
      embedUrl: string
      thumbnailUrl: string[]
    }
    expect(schema.embedUrl).toBe('https://www.youtube.com/embed/abc123')
    expect(schema.thumbnailUrl[0]).toContain('abc123')
  })

  it('still returns null if only one of the two fields is set', () => {
    const halfTour = { ...tour, youtubeId: 'abc123', videoUploadDate: null }
    expect(buildVideoObjectSchema(halfTour, copy)).toBeNull()
  })
})

describe('LOCALES sanity', () => {
  it('has exactly the four locales this whole module assumes', () => {
    expect(LOCALES).toEqual(['en', 'fr', 'es', 'pt'])
  })
})
