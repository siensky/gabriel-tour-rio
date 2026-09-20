import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TourCard } from '@/components/tour/TourCard'
import { tours } from '@/content/tours'
import en from '@/dictionaries/en.json'

const tour = tours.find((t) => !t.hub)!
const copy = tour.i18n.en!

describe('TourCard', () => {
  it('defaults to an h3 title — correct under RelatedTours\' and HubTemplate\'s h2', () => {
    render(<TourCard tour={tour} locale="en" dict={en} />)
    expect(screen.getByRole('heading', { level: 3, name: copy.title })).toBeInTheDocument()
  })

  it('accepts h2 — for /tours, which has no heading between its own h1 and the cards', () => {
    render(<TourCard tour={tour} locale="en" dict={en} headingLevel="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeInTheDocument()
  })

  it('accepts h4 — for homepage bands, whose own title is already an h3', () => {
    render(<TourCard tour={tour} locale="en" dict={en} headingLevel="h4" />)
    expect(screen.getByRole('heading', { level: 4, name: copy.title })).toBeInTheDocument()
  })

  it('featured cards lay out horizontally from sm: up', () => {
    const { container } = render(<TourCard tour={tour} locale="en" dict={en} featured />)
    expect(container.querySelector('article')?.className).toContain('sm:flex-row')
  })

  it('non-featured cards stay in the standard stacked layout', () => {
    const { container } = render(<TourCard tour={tour} locale="en" dict={en} />)
    expect(container.querySelector('article')?.className).not.toContain('sm:flex-row')
  })

  it('links the card to its own tour page', () => {
    render(<TourCard tour={tour} locale="en" dict={en} />)
    const heading = screen.getByRole('heading', { name: copy.title })
    // next/link drops a trailing slash outside a full router context — see
    // LanguageSwitcher.test.tsx; the real static export was already verified.
    expect(heading.querySelector('a')).toHaveAttribute('href', `/en/tours/${tour.slug}`)
  })

  it('shows the price when set, and a fallback when not', () => {
    const { rerender } = render(
      <TourCard tour={{ ...tour, priceFromBRL: 350 }} locale="en" dict={en} />,
    )
    expect(screen.getByText(/R\$ 350/)).toBeInTheDocument()

    rerender(<TourCard tour={{ ...tour, priceFromBRL: null }} locale="en" dict={en} />)
    expect(screen.getByText(en.tours.priceOnRequest)).toBeInTheDocument()
  })
})
