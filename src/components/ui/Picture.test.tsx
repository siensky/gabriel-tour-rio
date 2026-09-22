import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Picture, resolveImage } from '@/components/ui/Picture'
import type { ImageManifest } from '@/lib/image-manifest'

const sampleManifest: ImageManifest = {
  'christ-the-redeemer-hero': {
    width: 1600,
    height: 1066,
    formats: {
      avif: [
        { width: 480, path: 'img/christ-the-redeemer-hero-480.avif' },
        { width: 960, path: 'img/christ-the-redeemer-hero-960.avif' },
        { width: 1600, path: 'img/christ-the-redeemer-hero-1600.avif' },
      ],
      webp: [
        { width: 480, path: 'img/christ-the-redeemer-hero-480.webp' },
        { width: 960, path: 'img/christ-the-redeemer-hero-960.webp' },
        { width: 1600, path: 'img/christ-the-redeemer-hero-1600.webp' },
      ],
      jpg: [
        { width: 480, path: 'img/christ-the-redeemer-hero-480.jpg' },
        { width: 960, path: 'img/christ-the-redeemer-hero-960.jpg' },
        { width: 1600, path: 'img/christ-the-redeemer-hero-1600.jpg' },
      ],
    },
  },
}

describe('resolveImage', () => {
  it('finds an entry that exists in the manifest', () => {
    expect(resolveImage(sampleManifest, 'christ-the-redeemer-hero')).toBe(
      sampleManifest['christ-the-redeemer-hero'],
    )
  })

  it('returns undefined for a slug with no manifest entry', () => {
    expect(resolveImage(sampleManifest, 'no-such-photo')).toBeUndefined()
  })

  it('returns undefined for an empty slug without even checking the manifest', () => {
    expect(resolveImage(sampleManifest, '')).toBeUndefined()
  })
})

describe('Picture — no real photo yet (the current state of every tour)', () => {
  it('falls back to the placeholder, using alt as its caption', () => {
    render(<Picture src="" alt="Christ the Redeemer at sunrise" />)
    expect(screen.getByRole('img', { name: 'Christ the Redeemer at sunrise' })).toBeInTheDocument()
    // No real <picture>/<source> markup when there's nothing to source from.
    expect(document.querySelector('picture')).not.toBeInTheDocument()
  })

  it('also falls back for a slug the manifest simply has no entry for', () => {
    render(<Picture src="not-yet-shot" alt="A tour that has no photo yet" />)
    expect(document.querySelector('picture')).not.toBeInTheDocument()
  })
})

describe('Picture — a real photo exists in the manifest', () => {
  it('renders avif and webp <source> tags plus a jpg <img> fallback', () => {
    const { container } = render(
      <Picture src="christ-the-redeemer-hero" alt="Christ the Redeemer" manifest={sampleManifest} />,
    )

    const sources = container.querySelectorAll('source')
    expect(sources).toHaveLength(2)
    expect(sources[0]).toHaveAttribute('type', 'image/avif')
    expect(sources[1]).toHaveAttribute('type', 'image/webp')
    expect(sources[0].getAttribute('srcset')).toContain('christ-the-redeemer-hero-1600.avif 1600w')
  })

  it('sets width/height from the manifest — the actual zero-CLS mechanism', () => {
    render(<Picture src="christ-the-redeemer-hero" alt="Christ the Redeemer" manifest={sampleManifest} />)
    const img = screen.getByRole('img', { name: 'Christ the Redeemer' })
    expect(img).toHaveAttribute('width', '1600')
    expect(img).toHaveAttribute('height', '1066')
  })

  it('falls back to the largest jpg as the plain <img src>', () => {
    render(<Picture src="christ-the-redeemer-hero" alt="Christ the Redeemer" manifest={sampleManifest} />)
    const img = screen.getByRole('img', { name: 'Christ the Redeemer' })
    expect(img).toHaveAttribute('src', '/img/christ-the-redeemer-hero-1600.jpg')
  })

  it('priority images skip lazy-loading and hint high fetch priority', () => {
    render(
      <Picture
        src="christ-the-redeemer-hero"
        alt="Christ the Redeemer"
        manifest={sampleManifest}
        priority
      />,
    )
    const img = screen.getByRole('img', { name: 'Christ the Redeemer' })
    expect(img).not.toHaveAttribute('loading')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('non-priority images are lazy by default', () => {
    render(<Picture src="christ-the-redeemer-hero" alt="Christ the Redeemer" manifest={sampleManifest} />)
    const img = screen.getByRole('img', { name: 'Christ the Redeemer' })
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).not.toHaveAttribute('fetchpriority')
  })

  // Regression test for a real bug: the <img> used to carry a hardcoded
  // 'h-full w-full' base class. Tailwind utility conflicts aren't resolved
  // by string order, so appending a fixed 'h-16 w-16' via `className` didn't
  // reliably win — a logo meant to render at 64px rendered at ~300px+ in
  // the footer instead. There must be no competing size utility baked in.
  it('carries no hardcoded h-*/w-* class that could fight a caller’s own sizing', () => {
    render(
      <Picture
        src="christ-the-redeemer-hero"
        alt="Christ the Redeemer"
        manifest={sampleManifest}
        className="h-16 w-16 rounded-full"
      />,
    )
    const img = screen.getByRole('img', { name: 'Christ the Redeemer' })
    expect(img.className.split(' ')).toEqual(
      expect.arrayContaining(['h-16', 'w-16', 'rounded-full', 'object-cover']),
    )
    expect(img.className).not.toMatch(/\bh-full\b/)
    expect(img.className).not.toMatch(/\bw-full\b/)
  })
})
