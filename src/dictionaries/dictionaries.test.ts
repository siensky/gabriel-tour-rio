import { describe, expect, it } from 'vitest'

import en from '@/dictionaries/en.json'
import es from '@/dictionaries/es.json'
import fr from '@/dictionaries/fr.json'
import pt from '@/dictionaries/pt.json'

/** Flattens nested keys to dot paths, e.g. { nav: { tours: '' } } → ['nav.tours']. */
function keyPaths(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keyPaths(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

describe('dictionaries', () => {
  const englishKeys = keyPaths(en).sort()

  it.each([
    ['fr', fr],
    ['es', es],
    ['pt', pt],
  ])('%s has exactly the same keys as en.json', (_locale, dict) => {
    expect(keyPaths(dict).sort()).toEqual(englishKeys)
  })

  it('has at least the UI strings the layout and homepage depend on', () => {
    expect(englishKeys.length).toBeGreaterThan(0)
    expect(englishKeys).toContain('cta.bookOnWhatsapp')
    expect(englishKeys).toContain('whatsapp.general')
  })
})
