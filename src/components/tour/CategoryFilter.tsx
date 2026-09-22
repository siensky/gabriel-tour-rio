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
 *
 * The button row scrolls horizontally rather than wrapping — with up to
 * eight buttons ("All" + 7 categories) wrapping would eat several lines of
 * a phone screen; a swipeable row of chips is the standard mobile pattern
 * and reads fine on desktop too.
 */
export function CategoryFilter({
  tours,
  categories,
  locale,
  dict,
  headingLevel = 'h2',
}: {
  tours: Tour[]
  categories: TourCategory[]
  locale: Locale
  dict: Dictionary
  /** /tours has no heading between its own h1 and the cards (h2). The
   *  homepage nests this under its own "Choose your Rio" h2, so its cards
   *  need h3 — see TourCard for why the level must match its context. */
  headingLevel?: 'h2' | 'h3' | 'h4'
}) {
  const [active, setActive] = useState<TourCategory | 'all'>('all')

  const visible = active === 'all' ? tours : tours.filter((tour) => tour.category === active)

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label={dict.tours.title}
      >
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
          <TourCard
            key={tour.slug}
            tour={tour}
            locale={locale}
            dict={dict}
            headingLevel={headingLevel}
          />
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
        'min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        active ? 'bg-whatsapp text-ink' : 'bg-sand-deep text-ink-soft hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
