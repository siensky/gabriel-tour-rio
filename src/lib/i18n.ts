
import type { Dictionary, Locale } from '@/types'

/**
 * The four languages the interface is available in.
 * `en` is first because it is the default and the hreflang `x-default`.
 */
export const LOCALES = ['en', 'fr', 'es', 'pt'] as const

export const DEFAULT_LOCALE: Locale = 'en'

/** Shown in the language switcher — each language named in its own language. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * Dictionaries are imported dynamically so each page bundle only ever carries
 * the one language it renders. Static export resolves these at build time.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  fr: () => import('@/dictionaries/fr.json').then((m) => m.default),
  es: () => import('@/dictionaries/es.json').then((m) => m.default),
  pt: () => import('@/dictionaries/pt.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

/** Every locale, for `generateStaticParams` on the [locale] segment. */
export function localeParams() {
  return LOCALES.map((locale) => ({ locale }))
}
