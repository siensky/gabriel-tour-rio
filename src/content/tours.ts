import { LOCALES } from '@/lib/i18n'
import type { Locale } from '@/types'
import type { Tour, TourCategory, TourCopy } from '@/types/tour'

/**
 * Raw tour specs, in the exact order and clustering from the plan
 * ("Turer (24 st) — organiserade i kluster"). This is the only place a tour
 * is added, removed, or moved between tiers/categories/hubs.
 *
 * `hint` is a short human label used only to make the placeholder copy below
 * distinguishable while every field still carries a TODO prefix — it is never
 * shown to a visitor.
 */
type TourSpec = {
  slug: string
  hint: string
  tier: 1 | 2
  category: TourCategory
  hub?: true
  parent?: string
}

const TOUR_SPECS: TourSpec[] = [
  // Stad & kultur
  { slug: 'christ-the-redeemer-sugarloaf-tour', hint: 'Christ the Redeemer & Sugarloaf (flagship)', tier: 1, category: 'city' },
  { slug: 'christ-the-redeemer-tour', hint: 'Christ the Redeemer', tier: 1, category: 'city' },
  { slug: 'sugarloaf-cable-car-tour', hint: 'Sugarloaf Cable Car', tier: 1, category: 'city' },
  { slug: 'rio-city-tour', hint: 'Rio City Tour', tier: 1, category: 'city' },
  { slug: 'lapa-centro-walking-tour', hint: 'Lapa & Centro Walking Tour (incl. Selarón)', tier: 2, category: 'city' },
  { slug: 'maracana-stadium-tour', hint: 'Maracanã Stadium', tier: 2, category: 'city' },
  { slug: 'aquario-rio-tour', hint: 'AquaRio', tier: 2, category: 'city' },
  { slug: 'rio-by-night-tour', hint: 'Rio by Night', tier: 2, category: 'nightlife' },
  { slug: 'baile-funk-favela-party', hint: 'Baile Funk Party', tier: 2, category: 'nightlife' },

  // Favelor — hub + tre communities
  { slug: 'favela-tours', hint: 'Favela Tours (hub)', tier: 1, category: 'favela', hub: true },
  { slug: 'rocinha-favela-tour', hint: 'Rocinha — my neighbourhood', tier: 1, category: 'favela', parent: 'favela-tours' },
  { slug: 'vidigal-favela-tour', hint: 'Vidigal Favela', tier: 2, category: 'favela', parent: 'favela-tours' },
  { slug: 'santa-marta-favela-tour', hint: 'Santa Marta Favela', tier: 2, category: 'favela', parent: 'favela-tours' },

  // Vandring & natur — hub + tre leder
  { slug: 'hiking-rio-de-janeiro', hint: 'Hiking in Rio (hub)', tier: 1, category: 'hiking', hub: true },
  { slug: 'pedra-da-gavea-hike', hint: 'Pedra da Gávea Hike', tier: 2, category: 'hiking', parent: 'hiking-rio-de-janeiro' },
  { slug: 'two-brothers-hill-vidigal-hike', hint: 'Two Brothers Hill (Dois Irmãos)', tier: 1, category: 'hiking', parent: 'hiking-rio-de-janeiro' },
  { slug: 'tijuca-forest-hike', hint: 'Tijuca Forest Hike', tier: 2, category: 'hiking', parent: 'hiking-rio-de-janeiro' },

  // Stränder, vatten & dagsturer
  { slug: 'rio-beaches-tour', hint: 'Best Beaches of Rio', tier: 1, category: 'beach' },
  { slug: 'angra-dos-reis-boat-tour', hint: 'Angra dos Reis Boat Tour', tier: 2, category: 'water' },
  { slug: 'arraial-do-cabo-boat-tour', hint: 'Arraial do Cabo Day Trip', tier: 2, category: 'water' },
  { slug: 'ilha-grande-day-trip', hint: 'Ilha Grande Day Trip', tier: 2, category: 'water' },
  { slug: 'jet-ski-rio', hint: 'Jet Ski Rio', tier: 2, category: 'water' },
  { slug: 'speedboat-charter-rio', hint: 'Private Speedboat Charter', tier: 2, category: 'water' },
  { slug: 'rio-airport-transfer', hint: 'Airport Private Transfer', tier: 1, category: 'transfer' },
]

/**
 * Every text field, for every language, prefixed "TODO:" so nothing here can
 * be mistaken for real copy or accidentally ship live — see the plan's rule
 * "Ingen sida får gå live med platshållartext".
 *
 * Real content comes from Gabriel's voice memos (see the plan's
 * "Innehållsarbetsflöde"), transcribed and structured by AI, fact-checked by him.
 */
function placeholderCopy(hint: string, locale: Locale): TourCopy {
  const todo = (field: string) => `TODO: ${field} (${locale}) — ${hint}`

  return {
    title: todo('title'),
    metaTitle: todo('meta title, ≤60 chars'),
    metaDescription: todo('meta description, ≤155 chars'),
    tagline: todo('one-line tagline'),
    intro: todo('intro, 80–120 words'),
    body: [todo('body paragraph 1 of 4–6, 600–1000 words total')],
    highlights: [todo('highlight 1'), todo('highlight 2'), todo('highlight 3')],
    included: [todo('included 1')],
    notIncluded: [todo('not included 1')],
    faq: [{ question: todo('FAQ question 1'), answer: todo('FAQ answer 1') }],
    whatsappMessage: todo('pre-filled WhatsApp message'),
    imageAlt: [todo('hero image alt text')],
  }
}

function buildTour(spec: TourSpec, order: number): Tour {
  const i18n = Object.fromEntries(
    LOCALES.map((locale) => [locale, placeholderCopy(spec.hint, locale)]),
  ) as Record<Locale, TourCopy>

  return {
    slug: spec.slug,
    order,
    tier: spec.tier,
    category: spec.category,
    hub: spec.hub ?? false,
    parent: spec.parent ?? null,
    // TODO: real photos from Gabriel — <PlaceholderImage> renders until these are set.
    images: { hero: '', gallery: [] },
    youtubeId: null,
    videoUploadDate: null,
    // TODO: Gabriel fills these in — see the plan's "Gabriel's checklist".
    priceFromBRL: null,
    durationHours: null,
    groupSizeMax: null,
    i18n,
  }
}

export const tours: Tour[] = TOUR_SPECS.map((spec, index) => buildTour(spec, index + 1))

export function getTour(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug)
}

export function getToursByCategory(category: TourCategory): Tour[] {
  return tours.filter((tour) => tour.category === category).sort((a, b) => a.order - b.order)
}

/** Direct children of a hub, e.g. the three favela tours under favela-tours. */
export function getChildTours(hubSlug: string): Tour[] {
  return tours.filter((tour) => tour.parent === hubSlug).sort((a, b) => a.order - b.order)
}

export function getHubTour(slug: string): Tour | undefined {
  const tour = getTour(slug)
  return tour?.hub ? tour : undefined
}
