import { describe, expect, it } from 'vitest'

import { DEFAULT_LOCALE, LOCALES, getDictionary, isLocale, localeParams } from '@/lib/i18n'

describe('isLocale', () => {
  it('accepts the four supported locales', () => {
    for (const locale of LOCALES) {
      expect(isLocale(locale)).toBe(true)
    }
  })

  it('rejects anything else', () => {
    expect(isLocale('de')).toBe(false)
    expect(isLocale('')).toBe(false)
    expect(isLocale('EN')).toBe(false)
  })
})

describe('localeParams', () => {
  it('returns one param object per locale, for generateStaticParams', () => {
    expect(localeParams()).toEqual(LOCALES.map((locale) => ({ locale })))
  })
})

describe('getDictionary', () => {
  it('loads the matching dictionary for every locale', async () => {
    for (const locale of LOCALES) {
      const dict = await getDictionary(locale)
      expect(dict.nav.tours).toBeTruthy()
    }
  })

  it('the default locale is English', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })
})
