import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { JsonLd } from '@/components/seo/JsonLd'

/** Reads back the parsed JSON of every ld+json script tag in the container. */
function readScripts(container: HTMLElement): unknown[] {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
    (el) => JSON.parse(el.innerHTML),
  )
}

describe('JsonLd', () => {
  it('renders a single object as one script tag with matching JSON', () => {
    const { container } = render(<JsonLd data={{ '@type': 'WebSite', name: 'x' }} />)
    const scripts = readScripts(container)
    expect(scripts).toEqual([{ '@type': 'WebSite', name: 'x' }])
  })

  it('renders an array as one script tag per item, in order', () => {
    const { container } = render(
      <JsonLd data={[{ '@type': 'A' }, { '@type': 'B' }]} />,
    )
    expect(readScripts(container)).toEqual([{ '@type': 'A' }, { '@type': 'B' }])
  })

  it('drops null entries instead of emitting an empty script tag', () => {
    const { container } = render(<JsonLd data={[{ '@type': 'A' }, null, { '@type': 'B' }]} />)
    expect(readScripts(container)).toEqual([{ '@type': 'A' }, { '@type': 'B' }])
  })

  it('renders nothing at all when every entry is null', () => {
    const { container } = render(<JsonLd data={[null, null]} />)
    expect(container.querySelectorAll('script').length).toBe(0)
  })

  it('escapes "<" so a value can never break out of the script tag', () => {
    const { container } = render(<JsonLd data={{ name: '</script><script>alert(1)' }} />)
    const script = container.querySelector('script')!
    expect(script.innerHTML).not.toContain('</script><script>')
    expect(JSON.parse(script.innerHTML)).toEqual({ name: '</script><script>alert(1)' })
  })
})
