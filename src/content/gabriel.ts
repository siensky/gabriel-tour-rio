import { LOCALES } from '@/lib/i18n'
import type { Locale } from '@/types'
import type { GabrielCopy } from '@/types/gabriel'

/**
 * Gabriel's own story — the site's central differentiator (see the plan's
 * "Gabriels positionering"). Every field is a TODO placeholder until his
 * voice memos are transcribed (see "Innehållsarbetsflöde"): he records in
 * Portuguese, AI structures and translates, he fact-checks before anything
 * ships. Same rule as content/tours.ts — no page goes live with this text.
 */
function placeholderCopy(locale: Locale): GabrielCopy {
  const todo = (field: string) => `TODO: ${field} (${locale}) — Gabriel's story`

  return {
    headline: todo(`homepage headline, first person ("Hi, I'm Gabriel...")`),
    paragraphs: [
      todo('paragraph 1 — born and raised in Rio, lives in a favela'),
      todo('paragraph 2 — wants to show the warm, beautiful side of his community'),
      todo('paragraph 3 — not a crowd in matching vests, more like meeting a friend'),
      todo('paragraph 4 — every tour customised to what the guest wants'),
    ],
    signOff: todo('sign-off, e.g. "— Gabriel"'),
    aboutTitle: todo('about page title'),
    aboutIntro: todo('about page intro, 80–120 words'),
    aboutBody: [todo('about page body paragraph 1 of several — his full story')],
  }
}

export const gabriel: Record<Locale, GabrielCopy> = Object.fromEntries(
  LOCALES.map((locale) => [locale, placeholderCopy(locale)]),
) as Record<Locale, GabrielCopy>

/**
 * His portrait — one photo, not per-locale (a person doesn't have a
 * different face per language). Extension-less slug, same convention as
 * Tour.images.hero — see assets/raw/README.md.
 */
export const gabrielPortrait = 'gabriel-portrait'
