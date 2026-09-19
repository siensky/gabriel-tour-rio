import { describe, expect, it } from 'vitest'

import { business } from '@/content/business'
import { whatsappUrl } from '@/lib/whatsapp'

describe('whatsappUrl', () => {
  it('builds a wa.me link with the business phone number', () => {
    expect(whatsappUrl('hello')).toBe(`https://wa.me/${business.phone}?text=hello`)
  })

  it('URL-encodes the message, including spaces and punctuation', () => {
    const url = whatsappUrl('Hi Gabriel! Is 10am free?')
    expect(url).toBe(
      `https://wa.me/${business.phone}?text=Hi%20Gabriel!%20Is%2010am%20free%3F`,
    )
  })

  it('trims whitespace before deciding whether a message was given', () => {
    expect(whatsappUrl('   ')).toBe(`https://wa.me/${business.phone}`)
    expect(whatsappUrl('')).toBe(`https://wa.me/${business.phone}`)
  })

  it('uses the exact phone number from content/business.ts, digits only', () => {
    expect(business.phone).toMatch(/^\d+$/)
    expect(whatsappUrl('hi')).toContain(business.phone)
  })
})
