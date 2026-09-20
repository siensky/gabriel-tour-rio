import Link from 'next/link'

import { TourCard } from '@/components/tour/TourCard'
import type { Dictionary, Locale } from '@/types'
import type { Tour, TourCategory } from '@/types/tour'

/**
 * One category's worth of tours on the homepage — a few cards, then "see
 * all". The first card renders wider and horizontal (`featured`, spanning 2
 * of 3 grid columns) instead of matching the rest exactly, so the page reads
 * as designed rather than as a repeated tile — see TourCard's `featured` prop.
 */
export function TourCategoryBand({
  category,
  tours,
  locale,
  dict,
}: {
  category: TourCategory
  tours: Tour[]
  locale: Locale
  dict: Dictionary
}) {
  if (tours.length === 0) return null

  const [first, ...rest] = tours.slice(0, 3)

  return (
    <div className="mt-12 first:mt-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl sm:text-2xl">{dict.categories[category]}</h3>
        <Link
          href={`/${locale}/tours/`}
          className="shrink-0 text-sm font-semibold text-ocean hover:underline"
        >
          {dict.cta.seeAllTours}
        </Link>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2">
          <TourCard tour={first} locale={locale} dict={dict} featured headingLevel="h4" />
        </div>
        {rest.map((tour) => (
          <TourCard key={tour.slug} tour={tour} locale={locale} dict={dict} headingLevel="h4" />
        ))}
      </div>
    </div>
  )
}
