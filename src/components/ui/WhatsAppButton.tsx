import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { cn } from '@/lib/utils'
import { whatsappUrl } from '@/lib/whatsapp'

type Variant = 'nav' | 'hero' | 'card' | 'sticky'

const variants: Record<Variant, string> = {
  nav: 'bg-whatsapp text-white hover:bg-whatsapp-dark px-4 py-2 text-sm rounded-card',
  hero: 'bg-whatsapp text-white hover:bg-whatsapp-dark px-8 py-4 text-lg rounded-card shadow-lg',
  card: 'bg-whatsapp text-white hover:bg-whatsapp-dark px-4 py-2 text-sm rounded-card w-full',
  sticky:
    'bg-whatsapp text-white hover:bg-whatsapp-dark h-14 w-14 rounded-full shadow-xl fixed bottom-5 right-5 z-50 md:hidden',
}

/**
 * The single place a WhatsApp link is ever built.
 *
 * `message` is the pre-filled text and differs per page and language, which is
 * how Gabriel can tell which page a booking came from. Because every CTA on the
 * site renders through this component, changing the wording changes it
 * everywhere at once.
 */
export function WhatsAppButton({
  message,
  label,
  variant = 'nav',
  className,
}: {
  message: string
  /** Visible text. Omitted for the sticky variant, which is icon-only. */
  label?: string
  variant?: Variant
  className?: string
}) {
  const iconOnly = variant === 'sticky'

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={iconOnly ? label : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150',
        variants[variant],
        className,
      )}
    >
      <WhatsAppIcon className={iconOnly ? 'h-7 w-7' : 'h-5 w-5'} />
      {!iconOnly && label}
    </a>
  )
}
