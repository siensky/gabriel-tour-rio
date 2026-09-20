'use client'

import { useState, type ReactNode } from 'react'

import { TourCard } from '@/components/tour/TourCard'
import { cn } from '@/lib/utils'
import type { Dictionary, Locale } from '@/types'
import type { Tour, TourCategory } from '@/types/tour'

/**
 * The only interactive piece of the tour hall. Static export prerenders
 * client components too, so the "all" state — every tour — is what ships in
 * the initial HTML a crawler reads; clicking a filter only changes what's
 * rendered afterward, in the visitor's own browser.
 */
export function CategoryFilter({
  tours,
  categories,
  locale,
  dict,
}: {
  tours: Tour[]
  categories: TourCategory[]
  locale: Locale
  dict: Dictionary
}) {
  const [active, setActive] = useState<TourCategory | 'all'>('all')

  const visible = active === 'all' ? tours : tours.filter((tour) => tour.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={dict.tours.title}>
        <FilterButton active={active === 'all'} onClick={() => setActive('all')}>
          {dict.cta.seeAllTours}
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category}
            active={active === category}
            onClick={() => setActive(category)}
          >
            {dict.categories[category]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tour) => (
          // h2: this always sits right under the /tours page's own h1, with
          // nothing in between (no band heading like the homepage has).
          <TourCard key={tour.slug} tour={tour} locale={locale} dict={dict} headingLevel="h2" />
        ))}
      </div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-card px-4 py-2 text-sm font-semibold transition-colors',
        active ? 'bg-ink text-sand' : 'bg-sand-deep text-ink-soft hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
