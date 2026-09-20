import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { Section } from '@/components/ui/Section'
import { business } from '@/content/business'
import { gabriel, gabrielPortrait } from '@/content/gabriel'
import { cn } from '@/lib/utils'
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
  const paragraphs = variant === 'compact' ? copy.paragraphs.slice(0, 2) : copy.paragraphs
  const imageSize = variant === 'compact' ? 'max-w-[120px]' : 'max-w-[220px]'

  return (
    <Section tone="sand">
      <Container>
        <div
          className={cn(
            'grid gap-6 sm:items-start',
            variant === 'compact'
              ? 'sm:grid-cols-[minmax(0,120px)_1fr]'
              : 'sm:grid-cols-[minmax(0,220px)_1fr] gap-8',
          )}
        >
          <Picture
            src={gabrielPortrait}
            alt={business.legalName}
            className={cn('aspect-square w-full rounded-card', imageSize)}
            sizes="220px"
          />

          <div>
            {variant === 'full' && <h2 className="font-display text-2xl sm:text-3xl">{copy.headline}</h2>}

            <div className={cn('space-y-3 text-ink-soft', variant === 'full' && 'mt-4')}>
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
