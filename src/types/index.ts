import type en from '@/dictionaries/en.json'

import type { LOCALES } from '@/lib/i18n'

export type Locale = (typeof LOCALES)[number]

/**
 * The English dictionary is the source of truth for the shape of all the
 * others — if a key is added to en.json and missing elsewhere, typecheck fails.
 */
export type Dictionary = typeof en
