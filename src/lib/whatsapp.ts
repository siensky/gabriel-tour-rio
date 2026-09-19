import { business } from '@/content/business'

/**
 * Builds a wa.me link with a pre-filled message.
 *
 * Every page passes a different message, which doubles as free conversion
 * tracking: when the message arrives saying "the Christ the Redeemer tour",
 * Gabriel knows exactly which page it came from — no analytics needed.
 */
export function whatsappUrl(message: string): string {
  const base = `https://wa.me/${business.phone}`
  const trimmed = message.trim()

  return trimmed ? `${base}?text=${encodeURIComponent(trimmed)}` : base
}
