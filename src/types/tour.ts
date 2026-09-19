import type { Locale } from '@/types'

export type TourCategory =
  | 'city'
  | 'favela'
  | 'hiking'
  | 'beach'
  | 'water'
  | 'nightlife'
  | 'transfer'

export type TourCopy = {
  /** Used as both the <h1> and the base of the <title>. */
  title: string
  /** ≤60 characters. */
  metaTitle: string
  /** ≤155 characters. */
  metaDescription: string
  tagline: string
  /** 80–120 words. */
  intro: string
  /** 4–6 paragraphs, 600–1000 words total. */
  body: string[]
  highlights: string[]
  included: string[]
  notIncluded: string[]
  faq: { question: string; answer: string }[]
  /** Pre-filled WhatsApp text — see lib/whatsapp.ts. */
  whatsappMessage: string
  imageAlt: string[]
}

export type Tour = {
  slug: string
  order: number
  /** 1 = shipped in all four languages at launch. 2 = English first. */
  tier: 1 | 2
  category: TourCategory
  /** True for the two cluster hubs: favela-tours, hiking-rio-de-janeiro. */
  hub: boolean
  /** Slug of the hub this tour belongs under, or null for hubs/standalone tours. */
  parent: string | null
  images: { hero: string; gallery: string[] }
  youtubeId: string | null
  // TODO: Gabriel fills these in — see the plan's "Gabriel's checklist".
  priceFromBRL: number | null
  durationHours: number | null
  groupSizeMax: number | null
  i18n: Partial<Record<Locale, TourCopy>>
}
