import { LOCALES } from '@/lib/i18n'
import type { Locale } from '@/types'
import type { FaqItem } from '@/types/tour'

/**
 * Site-wide FAQ (booking, languages, general safety) — distinct from the
 * per-tour FAQ blocks in TourCopy.faq. This is the single source both the
 * /faq page and its FAQPage JSON-LD schema read from, so they can never drift
 * apart. TODO placeholders until Gabriel's real answers come in (see
 * "Innehållsarbetsflöde" in the plan) — no page ships this text live.
 */
const QUESTION_COUNT = 6

function placeholderFaq(locale: Locale): FaqItem[] {
  return Array.from({ length: QUESTION_COUNT }, (_, index) => ({
    question: `TODO: FAQ question ${index + 1} (${locale})`,
    answer: `TODO: FAQ answer ${index + 1} (${locale})`,
  }))
}

export const faq: Record<Locale, FaqItem[]> = Object.fromEntries(
  LOCALES.map((locale) => [locale, placeholderFaq(locale)]),
) as Record<Locale, FaqItem[]>
