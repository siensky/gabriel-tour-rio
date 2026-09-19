import Link from 'next/link'

import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import type { Dictionary, Locale } from '@/types'
import type { Tour } from '@/types/tour'

/**
 * One tour, three places: homepage category bands, /tours, and "related
 * tours" on a tour detail page.
 */
export function TourCard({
  tour,
  locale,
  dict,
}: {
  tour: Tour
  locale: Locale
  dict: Dictionary
}) {
  const copy = tour.i18n[locale]
  if (!copy) return null

  const href = `/${locale}/tours/${tour.slug}/`

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-sand-deep bg-sand">
      <Link href={href} className="block">
        <PlaceholderImage label={copy.title} className="aspect-[4/3] w-full" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ocean">
          {dict.categories[tour.category]}
        </span>

        <h3 className="font-display text-lg leading-snug">
          <Link href={href} className="hover:underline">
            {copy.title}
          </Link>
        </h3>

        <p className="line-clamp-2 flex-1 text-sm text-ink-soft">{copy.tagline}</p>

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
