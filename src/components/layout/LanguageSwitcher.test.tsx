import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LOCALES } from '@/lib/i18n'
import en from '@/dictionaries/en.json'

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/tours/christ-the-redeemer-tour/',
}))

describe('LanguageSwitcher', () => {
  it('shows the current locale code on a closed trigger, options hidden', () => {
    render(<LanguageSwitcher current="en" dict={en} />)

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveTextContent('en')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('opens on click and shows all four languages by name', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher current="en" dict={en} />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    for (const name of ['English', 'Français', 'Español', 'Português']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
  })

  // next/link drops a single trailing slash when rendered outside a full
  // Next.js router context (as here, under jsdom) — confirmed in Fas 3. The
  // real static export (trailingSlash: true) was already verified correct.
  it('only swaps the locale segment, keeping the rest of the path', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher current="en" dict={en} />)
    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('link', { name: 'Português' })).toHaveAttribute(
      'href',
      '/pt/tours/christ-the-redeemer-tour',
    )
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute(
      'href',
      '/es/tours/christ-the-redeemer-tour',
    )
  })

  it('marks the current language, and only the current language', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher current="fr" dict={en} />)
    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('link', { name: 'Français' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current')
  })

  it('closes when an option is chosen', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher current="en" dict={en} />)
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('link', { name: 'Français' }))

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher current="en" dict={en} />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <LanguageSwitcher current="en" dict={en} />
        <button type="button">outside</button>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: /language/i }))
    await user.click(screen.getByRole('button', { name: 'outside' }))

    expect(screen.getByRole('button', { name: /language/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  // Regression test: "Português" doesn't start with "Pt", so building the
  // label from the language name alone breaks WCAG 2.5.3 for exactly one
  // locale — the same bug fixed in Fas 5 for the old row-of-links version.
  // Checked for every locale so this can't quietly regress for a language
  // whose name happens not to start with its own code.
  it('the trigger label starts with the visible code, for every locale', () => {
    for (const locale of LOCALES) {
      render(<LanguageSwitcher current={locale} dict={en} />)
      const trigger = screen.getAllByRole('button').at(-1)!
      const label = trigger.getAttribute('aria-label') ?? ''
      expect(label.toUpperCase().startsWith(locale.toUpperCase())).toBe(true)
    }
  })

  it('tone="dark" styles the trigger for the footer’s dark background', () => {
    render(<LanguageSwitcher current="en" dict={en} tone="dark" />)
    expect(screen.getByRole('button').className).toContain('text-sand/70')
  })

  it('defaults to the light tone', () => {
    render(<LanguageSwitcher current="en" dict={en} />)
    expect(screen.getByRole('button').className).toContain('text-ink-soft')
  })
})
