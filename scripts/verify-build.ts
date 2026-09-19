/**
 * Post-`next build` sanity check.
 *
 * Confirms the static export actually contains what the plan expects: every
 * locale gets the same set of pages, and the count matches content/tours.ts —
 * the single source of truth — instead of a number hardcoded here that would
 * silently drift out of date as tours are added.
 *
 * Run after `npm run build`, from the project root: `npx tsx scripts/verify-build.ts`
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALES } from '../src/lib/i18n'
import { tours } from '../src/content/tours'

const OUT_DIR = join(process.cwd(), 'out')

// The static, non-tour routes under every [locale] segment.
const STATIC_LOCALE_PAGES = ['', 'tours', 'about', 'faq', 'contact']

function fail(message: string): never {
  console.error(`✗ ${message}`)
  process.exit(1)
}

function countIndexHtml(dir: string): number {
  if (!existsSync(dir)) return 0
  let count = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) count += countIndexHtml(full)
    else if (entry === 'index.html') count += 1
  }
  return count
}

if (!existsSync(OUT_DIR)) {
  fail(`"out/" does not exist — run "npm run build" first.`)
}

const expectedPerLocale = STATIC_LOCALE_PAGES.length + tours.length
const expectedTotal = expectedPerLocale * LOCALES.length

let ok = true

for (const locale of LOCALES) {
  const localeDir = join(OUT_DIR, locale)
  const actual = countIndexHtml(localeDir)

  if (actual !== expectedPerLocale) {
    ok = false
    console.error(
      `✗ /${locale}/ has ${actual} pages, expected ${expectedPerLocale} ` +
        `(${STATIC_LOCALE_PAGES.length} static + ${tours.length} tours)`,
    )
  }

  // Every tour slug must exist under every locale — see the plan's Fas 2
  // decision to build all four locales now, even for tier-2 tours, and defer
  // the "English only until it's real" cut to deploy time.
  for (const tour of tours) {
    const tourDir = join(localeDir, 'tours', tour.slug, 'index.html')
    if (!existsSync(tourDir)) {
      ok = false
      console.error(`✗ Missing /${locale}/tours/${tour.slug}/`)
    }
  }
}

if (!ok) {
  fail('Build verification failed — see above.')
}

const actualTotal = LOCALES.reduce((sum, locale) => sum + countIndexHtml(join(OUT_DIR, locale)), 0)
console.log(`✓ ${actualTotal} pages across ${LOCALES.length} locales (${expectedPerLocale} per locale)`)
