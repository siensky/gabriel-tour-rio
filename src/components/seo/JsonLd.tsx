/**
 * Renders one or more schema.org objects as <script type="application/ld+json">
 * tags. `null` entries are dropped silently — schema builders (see lib/seo.ts)
 * return `null` when there's nothing valid to emit yet (e.g. no FAQ items, no
 * video), so callers can pass their result straight through without an `if`.
 *
 * `</` is escaped so a value containing it (none currently do — all data here
 * is our own, never user input) can never break out of the script tag.
 */
export function JsonLd({ data }: { data: object | null | (object | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is object => item !== null,
  )

  if (items.length === 0) return null

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
