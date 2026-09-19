import Link from 'next/link'

import { TourCard } from '@/components/tour/TourCard'
import type { Dictionary, Locale } from '@/types'
import type { Tour, TourCategory } from '@/types/tour'

/** One category's worth of tours on the homepage — a few cards, then "see all". */
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

  const preview = tours.slice(0, 3)

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
        {preview.map((tour) => (
          <TourCard key={tour.slug} tour={tour} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  )
}
