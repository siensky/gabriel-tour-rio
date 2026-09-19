import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CategoryFilter } from '@/components/tour/CategoryFilter'
import en from '@/dictionaries/en.json'
import { tours } from '@/content/tours'

// Two categories, two tours each — enough to prove filtering works without
// depending on the exact current contents of content/tours.ts.
const fixtureTours = [
  tours.find((t) => t.category === 'city' && !t.hub)!,
  tours.find((t) => t.category === 'water')!,
]

describe('CategoryFilter', () => {
  it('shows every tour when "all" is selected (the default)', () => {
    render(
      <CategoryFilter tours={fixtureTours} categories={['city', 'water']} locale="en" dict={en} />,
    )
    for (const tour of fixtureTours) {
      expect(screen.getByRole('heading', { name: tour.i18n.en!.title })).toBeInTheDocument()
    }
  })

  it('clicking a category button leaves only that category rendered', async () => {
    const user = userEvent.setup()
    render(
      <CategoryFilter tours={fixtureTours} categories={['city', 'water']} locale="en" dict={en} />,
    )

    await user.click(screen.getByRole('button', { name: en.categories.city }))

    expect(screen.getByRole('heading', { name: fixtureTours[0].i18n.en!.title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: fixtureTours[1].i18n.en!.title })).not.toBeInTheDocument()
  })

  it('marks the active filter button with aria-pressed', async () => {
    const user = userEvent.setup()
    render(
      <CategoryFilter tours={fixtureTours} categories={['city', 'water']} locale="en" dict={en} />,
    )

    const cityButton = screen.getByRole('button', { name: en.categories.city })
    expect(cityButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(cityButton)
    expect(cityButton).toHaveAttribute('aria-pressed', 'true')
  })
})
