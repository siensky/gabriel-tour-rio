/**
 * Single source of truth for name, phone and links.
 *
 * NAP consistency (Name / Address / Phone identical everywhere — site, Google
 * Business Profile, Instagram, TripAdvisor, business card) is a hard local-SEO
 * ranking factor. Change it here and nowhere else.
 */
export const business = {
  name: 'Gabriel Tour Rio',
  legalName: 'Gabriel Henrique da Silva',

  /** E.164, digits only — this exact string builds the wa.me links. */
  phone: '5521979226833',
  phoneDisplay: '+55 21 97922-6833',

  instagram: 'https://instagram.com/gabrielzsul77',
  instagramHandle: '@gabrielzsul77',

  // TODO: an email fallback is required before launch — not everyone uses
  // WhatsApp, and a single contact channel loses bookings.
  email: null as string | null,

  // TODO: fill in once the Google Business Profile is approved. This URL goes
  // into the TravelAgency `sameAs` array, which is the technical link between
  // the site and the Maps listing.
  googleBusinessProfile: null as string | null,

  areaServed: 'Rio de Janeiro, RJ, Brazil',
  geo: { latitude: -22.9068, longitude: -43.1729 },

  languages: ['English', 'Português', 'Español', 'Français'],
} as const

/** Absolute site URL — used for canonicals, hreflang, sitemap and OG tags. */
export const SITE_URL = 'https://gabrieltourrio.com'
