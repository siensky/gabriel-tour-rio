import Link from 'next/link'

import { Picture } from '@/components/ui/Picture'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { cn } from '@/lib/utils'
import type { Dictionary, Locale } from '@/types'
import type { Tour } from '@/types/tour'

/**
 * One tour, three places: homepage category bands, /tours, and "related
 * tours" on a tour detail page.
 *
 * `featured` gives it a wider, horizontal layout instead of the standard
 * stacked card — used for the first card in each homepage band, so the grid
 * isn't a uniform wall of identical tiles (see the plan's "ska inte se
 * AI-designat ut": "3-kolumnsrutnät med identiska rundade kort" is exactly
 * what to avoid).
 *
 * `headingLevel` defaults to h3 (correct under RelatedTours' and
 * HubTemplate's h2), but /tours has no heading between its own h1 and the
 * cards (needs h2), and each homepage band title is already an h3 (its cards
 * need h4) — Lighthouse's heading-order audit catches a skipped level, so
 * each call site sets this to match its own surrounding structure.
 */
export function TourCard({
  tour,
  locale,
  dict,
  featured = false,
  headingLevel: Heading = 'h3',
}: {
  tour: Tour
  locale: Locale
  dict: Dictionary
  featured?: boolean
  headingLevel?: 'h2' | 'h3' | 'h4'
}) {
  const copy = tour.i18n[locale]
  if (!copy) return null

  const href = `/${locale}/tours/${tour.slug}/`

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-card border border-sand-deep bg-sand',
        featured && 'sm:flex-row',
      )}
    >
      <Link href={href} className={cn('block', featured && 'sm:w-2/5 sm:shrink-0')}>
        <Picture
          src={tour.images.hero}
          alt={copy.imageAlt[0] ?? copy.title}
          className={featured ? 'aspect-[4/3] w-full sm:h-full' : 'aspect-[4/3] w-full'}
          sizes={
            featured
              ? '(min-width: 640px) 40vw, 100vw'
              : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
          }
          // No `priority` here — a category band's featured card is never
          // the page's actual LCP element (only TourHero is, on tour pages).
          // Marking several cards high-priority would just have them compete
          // for bandwidth instead of helping any one of them load faster.
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ocean">
          {dict.categories[tour.category]}
        </span>

        <Heading className={cn('font-display leading-snug', featured ? 'text-2xl' : 'text-lg')}>
          <Link href={href} className="hover:underline">
            {copy.title}
          </Link>
        </Heading>

        <p
          className={cn(
            'flex-1 text-sm text-ink-soft',
            featured ? 'line-clamp-3' : 'line-clamp-2',
          )}
        >
          {copy.tagline}
        </p>

        {tour.priceFromBRL !== null ? (
          <p className="text-sm font-semibold">
            {dict.tours.from} R$ {tour.priceFromBRL}
          </p>
        ) : (
          <p className="text-sm text-ink-soft">{dict.tours.priceOnRequest}</p>
        )}

        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center rounded-card border border-ink px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-sand"
          >
            {dict.cta.viewTour}
          </Link>
          <WhatsAppButton
            variant="card"
            label={dict.cta.bookOnWhatsapp}
            message={copy.whatsappMessage}
            className="flex-1"
          />
        </div>
      </div>
    </article>
  )
}
