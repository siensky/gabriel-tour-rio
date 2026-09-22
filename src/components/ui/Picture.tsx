import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { imageManifest, type ImageManifest, type ImageManifestEntry } from '@/lib/image-manifest'
import { cn } from '@/lib/utils'

/**
 * Looks up a slug in the manifest. Exported and pure so it's testable
 * without needing to mock the JSON import — see Picture.test.tsx.
 */
export function resolveImage(
  manifest: ImageManifest,
  src: string,
): ImageManifestEntry | undefined {
  if (!src) return undefined
  return manifest[src]
}

function srcSet(entry: ImageManifestEntry, format: 'avif' | 'webp' | 'jpg'): string {
  return entry.formats[format].map((variant) => `/${variant.path} ${variant.width}w`).join(', ')
}

/**
 * The site's one image component. Falls back to <PlaceholderImage> for any
 * slug with no real photo yet (currently every tour — see content/tours.ts),
 * so call sites never need an `if`: swap in a real photo by dropping it in
 * assets/raw/ and re-running the pipeline, no component code changes.
 *
 * `alt` doubles as the placeholder's visible caption, matching the pattern
 * already used everywhere else on this site (TODO text is shown, not hidden,
 * until real content replaces it).
 */
export function Picture({
  src,
  alt,
  className,
  priority = false,
  sizes = '100vw',
  manifest = imageManifest,
}: {
  /** Extension-less slug — see assets/raw/README.md. Empty string = no photo yet. */
  src: string
  alt: string
  className?: string
  /** Hero images: skips lazy-loading and hints the browser to fetch it first. */
  priority?: boolean
  sizes?: string
  /** Only ever overridden in tests — real call sites use the real manifest. */
  manifest?: ImageManifest
}) {
  const entry = resolveImage(manifest, src)

  if (!entry) {
    return <PlaceholderImage label={alt} className={className} />
  }

  // Largest JPEG as the universal fallback — every browser understands it,
  // even ones too old for the <source> negotiation above to match.
  const fallback = entry.formats.jpg.at(-1)

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(entry, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(entry, 'webp')} sizes={sizes} />
      <img
        src={fallback ? `/${fallback.path}` : undefined}
        srcSet={srcSet(entry, 'jpg')}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt}
        // object-cover only — no hardcoded h-full/w-full. Tailwind utility
        // conflicts aren't resolved by string order (h-16 appended after
        // h-full doesn't reliably win), so a caller's own sizing classes
        // must be the only source of size, never fighting a baked-in default.
        className={cn('object-cover', className)}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}
