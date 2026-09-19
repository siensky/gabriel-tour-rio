import { notFound } from 'next/navigation'

import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { gabriel } from '@/content/gabriel'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'

export function generateStaticParams() {
  return localeParams()
}

/**
 * The full version of Gabriel's story. The homepage section (variant="full")
 * gives the short version and links here; this page carries the longer
 * `aboutBody`. `linkToAbout={false}` because linking to the page you're
 * already on is dead weight.
 *
 * Content is TODO placeholder — see content/gabriel.ts — pending his voice
 * memos. The Person JSON-LD schema is added in Fas 4 with the rest of the
 * structured-data layer, not here.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)
  const copy = gabriel[locale]

  return (
    <>
      <AboutGabriel locale={locale} dict={dict} variant="full" linkToAbout={false} />

      <Section tone="sandDeep">
        <Container>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{copy.aboutTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{copy.aboutIntro}</p>

          <div className="mt-8 max-w-2xl space-y-4 text-ink-soft">
            {copy.aboutBody.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
