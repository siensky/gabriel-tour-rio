import { cn } from '@/lib/utils'

/**
 * Stands in for a tour photo until Gabriel's real photos arrive (see
 * content/tours.ts — every `images.hero` is empty for now). A gradient in
 * the site's own palette plus the tour name, so pages are legible without any
 * external image file that would just need replacing later.
 */
export function PlaceholderImage({
  label,
  className,
  showLabel = true,
}: {
  label: string
  className?: string
  /** False when used as a full-bleed background behind real overlaid
   *  heading text (the homepage hero) — the centred caption would otherwise
   *  sit right on top of that text. The box stays announced via aria-label
   *  either way; only the redundant visible caption is skipped. */
  showLabel?: boolean
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-ocean to-forest p-6 text-center',
        className,
      )}
    >
      {showLabel && (
        <span className="font-display text-lg font-semibold text-sand/90">{label}</span>
      )}
    </div>
  )
}
