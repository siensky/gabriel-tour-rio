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

  const priceLine = [
    tour.durationHours !== null ? `${tour.durationHours} ${dict.tours.hours}` : null,
    tour.priceFromBRL !== null ? `${dict.tours.from} R$ ${tour.priceFromBRL}` : dict.tours.priceOnRequest,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md',
        featured && 'sm:flex-row',
      )}
    >
      <Link href={href} className={cn('relative block', featured && 'sm:w-2/5 sm:shrink-0')}>
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
        <span className="absolute left-3 top-3 rounded-full bg-badge-gold px-3 py-1 text-xs font-semibold text-ink">
          {dict.categories[tour.category]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
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

        <p className="text-sm font-semibold text-ink">{priceLine}</p>

        <WhatsAppButton
          variant="card"
          label={dict.cta.bookOnWhatsapp}
          message={copy.whatsappMessage}
          className="mt-1"
        />
      </div>
    </article>
  )
}
