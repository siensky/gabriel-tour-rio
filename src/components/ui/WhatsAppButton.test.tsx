import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { business } from '@/content/business'

describe('WhatsAppButton', () => {
  it('builds its href from the given message, via lib/whatsapp', () => {
    render(<WhatsAppButton message="Interested in the Cristo tour" label="Book" />)
    const link = screen.getByRole('link', { name: 'Book' })
    expect(link).toHaveAttribute(
      'href',
      `https://wa.me/${business.phone}?text=Interested%20in%20the%20Cristo%20tour`,
    )
  })

  it('opens in a new tab safely', () => {
    render(<WhatsAppButton message="hi" label="Book" />)
    const link = screen.getByRole('link', { name: 'Book' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('the sticky variant is icon-only but still has an accessible name', () => {
    render(<WhatsAppButton message="hi" label="Book on WhatsApp" variant="sticky" />)
    expect(screen.getByRole('link', { name: 'Book on WhatsApp' })).toBeInTheDocument()
    // Icon-only: the label is not rendered as visible text.
    expect(screen.queryByText('Book on WhatsApp')).not.toBeInTheDocument()
  })
})
