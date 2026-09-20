import { describe, expect, it } from 'vitest'

import { faq } from '@/content/faq'
import { LOCALES } from '@/lib/i18n'

describe('faq content', () => {
  it('has the same number of questions in every locale', () => {
    const counts = LOCALES.map((locale) => faq[locale].length)
    expect(new Set(counts).size).toBe(1)
    expect(counts[0]).toBeGreaterThan(0)
  })

  it('every question and answer is non-empty text', () => {
    for (const locale of LOCALES) {
      for (const item of faq[locale]) {
        expect(item.question.length).toBeGreaterThan(0)
        expect(item.answer.length).toBeGreaterThan(0)
      }
    }
  })
})
