import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/tours/christ-the-redeemer-tour/',
}))

describe('LanguageSwitcher', () => {
  // next/link normalises away a single trailing slash when rendered outside a
  // full Next.js router context (as here, under jsdom) — confirmed in isolation
  // and unrelated to this component. The real static export (trailingSlash:
  // true) was already verified to produce correct /locale/path/ URLs in the
  // Fas 1–2 builds, so these assertions match what next/link actually renders
  // in a unit test rather than re-asserting Next's own behaviour.
  it('only swaps the locale segment, keeping the rest of the path', () => {
    render(<LanguageSwitcher current="en" />)

    expect(screen.getByRole('link', { name: 'Português' })).toHaveAttribute(
      'href',
      '/pt/tours/christ-the-redeemer-tour',
    )
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute(
      'href',
      '/es/tours/christ-the-redeemer-tour',
    )
  })

  it('marks the current language, and only the current language', () => {
    render(<LanguageSwitcher current="fr" />)

    expect(screen.getByRole('link', { name: 'Français' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current')
  })

  it('renders all four locales', () => {
    render(<LanguageSwitcher current="en" />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })
})
