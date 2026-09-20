import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { gabriel } from '@/content/gabriel'
import en from '@/dictionaries/en.json'

describe('AboutGabriel', () => {
  it('full variant shows the headline and every paragraph', () => {
    render(<AboutGabriel locale="en" dict={en} variant="full" />)

    expect(screen.getByRole('heading', { name: gabriel.en.headline })).toBeInTheDocument()
    for (const paragraph of gabriel.en.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('compact variant shows fewer paragraphs and no headline', () => {
    render(<AboutGabriel locale="en" dict={en} variant="compact" />)

    expect(screen.queryByRole('heading', { name: gabriel.en.headline })).not.toBeInTheDocument()
    expect(screen.getByText(gabriel.en.paragraphs[0])).toBeInTheDocument()
    expect(screen.queryByText(gabriel.en.paragraphs[gabriel.en.paragraphs.length - 1])).not.toBeInTheDocument()
  })

  it('links to /about by default, in the current locale', () => {
    render(<AboutGabriel locale="pt" dict={en} variant="compact" />)
    // next/link drops a single trailing slash when rendered outside a full
    // Next.js router context (confirmed in isolation) — the real static
    // export (trailingSlash: true) was already verified correct in Fas 1–2.
    expect(screen.getByRole('link', { name: en.cta.readMoreAboutGabriel })).toHaveAttribute(
      'href',
      '/pt/about',
    )
  })

  it('hides the link when linkToAbout is false', () => {
    render(<AboutGabriel locale="en" dict={en} variant="full" linkToAbout={false} />)
    expect(screen.queryByRole('link', { name: en.cta.readMoreAboutGabriel })).not.toBeInTheDocument()
  })

  it('always shows the sign-off, in the handwriting-style signature font', () => {
    render(<AboutGabriel locale="en" dict={en} variant="compact" />)
    const signOff = screen.getByText(gabriel.en.signOff)
    expect(signOff).toHaveClass('font-signature')
  })
})
