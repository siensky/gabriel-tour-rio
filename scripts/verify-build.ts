/**
 * Post-`next build` sanity check.
 *
 * Confirms the static export actually contains what the plan expects: every
 * locale gets the same set of pages, and the count matches content/tours.ts —
 * the single source of truth — instead of a number hardcoded here that would
 * silently drift out of date as tours are added. From Fas 4: also checks
 * sitemap.xml, robots.txt, and hreflang reciprocity across every page — the
 * plan's Verifiering section calls out a missing/mismatched hreflang set as
 * "the most common hreflang bug".
 *
 * Run after `npm run build`, from the project root: `npx tsx scripts/verify-build.ts`
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { SITE_URL } from '../src/content/business'
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

// ---------------------------------------------------------------------------
// sitemap.xml + robots.txt
// ---------------------------------------------------------------------------

const sitemapPath = join(OUT_DIR, 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  ok = false
  console.error('✗ out/sitemap.xml was not generated')
} else {
  const sitemapXml = readFileSync(sitemapPath, 'utf8')
  const urlCount = (sitemapXml.match(/<loc>/g) ?? []).length
  if (urlCount !== expectedTotal) {
    ok = false
    console.error(`✗ sitemap.xml has ${urlCount} <loc> entries, expected ${expectedTotal}`)
  }
}

const robotsPath = join(OUT_DIR, 'robots.txt')
if (!existsSync(robotsPath)) {
  ok = false
  console.error('✗ out/robots.txt was not generated')
} else if (!readFileSync(robotsPath, 'utf8').includes(`${SITE_URL}/sitemap.xml`)) {
  ok = false
  console.error('✗ robots.txt does not reference the sitemap')
}

// ---------------------------------------------------------------------------
// hreflang reciprocity — every page must declare exactly the four locales it
// actually has plus x-default, each pointing at a real, existing page.
// ---------------------------------------------------------------------------

function hreflangHrefs(html: string): Record<string, string> {
  const links: Record<string, string> = {}
  const pattern = /<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g
  for (const match of html.matchAll(pattern)) links[match[1]] = match[2]
  return links
}

for (const locale of LOCALES) {
  for (const path of [...STATIC_LOCALE_PAGES, ...tours.map((t) => `tours/${t.slug}`)]) {
    const filePath = path
      ? join(OUT_DIR, locale, ...path.split('/'), 'index.html')
      : join(OUT_DIR, locale, 'index.html')
    if (!existsSync(filePath)) continue // already reported above

    const links = hreflangHrefs(readFileSync(filePath, 'utf8'))
    const expectedKeys = [...LOCALES, 'x-default'].sort()
    const actualKeys = Object.keys(links).sort()

    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      ok = false
      console.error(
        `✗ /${locale}/${path}/ hreflang set is [${actualKeys.join(', ')}], expected [${expectedKeys.join(', ')}]`,
      )
      continue
    }

    for (const [lang, href] of Object.entries(links)) {
      if (lang === 'x-default') continue
      const target = join(OUT_DIR, lang, ...(path ? path.split('/') : []), 'index.html')
      if (!existsSync(target)) {
        ok = false
        console.error(`✗ /${locale}/${path}/ hreflang="${lang}" points at ${href}, which doesn't exist`)
      }
    }
  }
}

if (!ok) {
  fail('Build verification failed — see above.')
}

const actualTotal = LOCALES.reduce((sum, locale) => sum + countIndexHtml(join(OUT_DIR, locale)), 0)
console.log(`✓ ${actualTotal} pages across ${LOCALES.length} locales (${expectedPerLocale} per locale)`)
console.log(`✓ sitemap.xml has ${expectedTotal} URLs, robots.txt references it`)
console.log(`✓ hreflang reciprocity holds on every page`)
