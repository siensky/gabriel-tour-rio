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

    expect(screen.getByRole('link', { name: 'PT — Português' })).toHaveAttribute(
      'href',
      '/pt/tours/christ-the-redeemer-tour',
    )
    expect(screen.getByRole('link', { name: 'ES — Español' })).toHaveAttribute(
      'href',
      '/es/tours/christ-the-redeemer-tour',
    )
  })

  it('marks the current language, and only the current language', () => {
    render(<LanguageSwitcher current="fr" />)

    expect(screen.getByRole('link', { name: 'FR — Français' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: 'EN — English' })).not.toHaveAttribute('aria-current')
  })

  it('renders all four locales', () => {
    render(<LanguageSwitcher current="en" />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('every accessible name starts with the visible code — WCAG 2.5.3 Label in Name', () => {
    render(<LanguageSwitcher current="en" />)
    for (const link of screen.getAllByRole('link')) {
      const visibleText = link.textContent?.toUpperCase() ?? ''
      expect(link.getAttribute('aria-label')?.startsWith(visibleText)).toBe(true)
    }
  })

  // Regression test for a real bug: text-ink-soft (the default inactive
  // colour, built for the light header background) is nearly invisible on
  // the footer's dark bg-forest — 1.34:1 contrast, caught by Lighthouse.
  it('tone="dark" swaps inactive links away from text-ink-soft', () => {
    render(<LanguageSwitcher current="en" tone="dark" />)
    const inactive = screen.getByRole('link', { name: 'FR — Français' })
    expect(inactive.className).not.toContain('text-ink-soft')
    expect(inactive.className).toContain('text-sand/70')
  })

  it('defaults to the light tone (text-ink-soft) when tone is not given', () => {
    render(<LanguageSwitcher current="en" />)
    const inactive = screen.getByRole('link', { name: 'FR — Français' })
    expect(inactive.className).toContain('text-ink-soft')
  })
})
