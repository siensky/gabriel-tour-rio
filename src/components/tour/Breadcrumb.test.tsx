import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Breadcrumb } from '@/components/tour/Breadcrumb'
import en from '@/dictionaries/en.json'

describe('Breadcrumb', () => {
  // next/link drops a single trailing slash when rendered outside a full
  // Next.js router context (as here, under jsdom) — confirmed in Fas 3
  // (see LanguageSwitcher.test.tsx). The real static export (trailingSlash:
  // true) was already verified to produce correct /locale/path/ URLs.
  it('always starts with Home, then exactly the given trail — no hardcoded Tours segment', () => {
    render(
      <Breadcrumb locale="en" dict={en} trail={[{ href: '/en/about/', label: 'About Gabriel' }]} />,
    )

    expect(screen.getByRole('link', { name: en.common.backToHome })).toHaveAttribute('href', '/en')
    // "Tours" must not appear on a page that never declared it in its trail.
    expect(screen.queryByText(en.nav.tours)).not.toBeInTheDocument()
  })

  it('renders every crumb but the last as a link', () => {
    render(
      <Breadcrumb
        locale="en"
        dict={en}
        trail={[
          { href: '/en/tours/', label: 'Tours' },
          { href: '/en/tours/favela-tours/', label: 'Favela Tours' },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: 'Tours' })).toHaveAttribute('href', '/en/tours')
    // The current page is plain text with aria-current, not a link.
    expect(screen.queryByRole('link', { name: 'Favela Tours' })).not.toBeInTheDocument()
    expect(screen.getByText('Favela Tours')).toHaveAttribute('aria-current', 'page')
  })
})
