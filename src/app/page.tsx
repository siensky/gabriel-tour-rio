import { DEFAULT_LOCALE } from '@/lib/i18n'

export const metadata = {
  robots: { index: false, follow: false },
}

/**
 * Bare "/" sends visitors to the default language.
 *
 * Static export has no middleware, so this is a meta-refresh plus a real link.
 * On Cloudflare Pages the _redirects rule fires first and this is never seen.
 */
export default function RootRedirect() {
  const target = `/${DEFAULT_LOCALE}/`

  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <a href={target}>Continue to Gabriel Tour Rio</a>
      </body>
    </html>
  )
}
