import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { Section } from '@/components/ui/Section'
import { business } from '@/content/business'
import { gabriel, gabrielPortrait } from '@/content/gabriel'
import { LOCALES } from '@/lib/i18n'
import type { Dictionary, Locale } from '@/types'

/**
 * One story, two places (see the plan's "Nyckelkomponenter som återanvänds"):
 *
 * - "full": the homepage section, directly under the hero, before the tour
 *   listing — the site's differentiator, not a footnote (see the plan's
 *   "Gabriels positionering") — and the /about page's main content.
 * - "compact": the shorter author byline reused at the bottom of every tour
 *   page, tying that page's content back to a real, named local guide.
 *
 * `linkToAbout` renders a "read the full story" link to /about; pass `false`
 * only on the /about page itself, where linking to the current page is dead weight.
 */
export function AboutGabriel({
  locale,
  dict,
  variant = 'full',
  linkToAbout = true,
}: {
  locale: Locale
  dict: Dictionary
  variant?: 'full' | 'compact'
  linkToAbout?: boolean
}) {
  const copy = gabriel[locale]

  if (variant === 'compact') {
    const paragraphs = copy.paragraphs.slice(0, 2)

    return (
      <Section tone="sand">
        <Container>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,120px)_1fr] sm:items-start">
            <Picture
              src={gabrielPortrait}
              alt={business.legalName}
              className="aspect-square w-full max-w-[120px] rounded-card"
              sizes="120px"
            />

            <div>
              <div className="space-y-3 text-ink-soft">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-3 font-signature text-3xl text-sunset">{copy.signOff}</p>

              {linkToAbout && (
                // Visible text itself is descriptive ("Read more" alone reads
                // fine in context but fails Lighthouse's link-text audit,
                // which checks the rendered text, not aria-label).
                <Link
                  href={`/${locale}/about/`}
                  className="mt-4 inline-block text-sm font-semibold text-ocean hover:underline"
                >
                  {dict.cta.readMoreAboutGabriel}
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section tone="sand" id="about">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
          <Picture
            src={gabrielPortrait}
            alt={business.legalName}
            className="aspect-[4/5] w-full rounded-card"
            sizes="(min-width: 640px) 50vw, 100vw"
          />

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest">
              {dict.nav.about}
            </span>

            <h2 className="mt-2 font-display text-3xl sm:text-4xl">{copy.headline}</h2>

            <div className="mt-4 space-y-3 text-ink-soft">
              {copy.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-3 font-signature text-3xl text-forest">{copy.signOff}</p>

            {/* The languages Gabriel speaks — the one credential here that's
                actually true today, standing in for the mockup's rating/
                years-guiding badges (both fabricated numbers we don't have). */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-deep px-3 py-1.5 text-xs font-semibold text-ink">
                {LOCALES.map((code) => code.toUpperCase()).join(' · ')}
              </span>
            </div>

            {linkToAbout && (
              <Link
                href={`/${locale}/about/`}
                className="mt-5 inline-block text-sm font-semibold text-forest hover:underline"
              >
                {dict.cta.readMoreAboutGabriel}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
