import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { Breadcrumb } from '@/components/tour/Breadcrumb'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { gabriel } from '@/content/gabriel'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildBreadcrumbSchema, buildMetadata, buildPersonSchema, type Crumb } from '@/lib/seo'

export function generateStaticParams() {
  return localeParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const dict = await getDictionary(locale)
  return buildMetadata({
    locale,
    path: 'about',
    title: dict.meta.about.title,
    description: dict.meta.about.description,
  })
}

/**
 * The full version of Gabriel's story. The homepage section (variant="full")
 * gives the short version and links here; this page carries the longer
 * `aboutBody`. `linkToAbout={false}` because linking to the page you're
 * already on is dead weight.
 *
 * Content is TODO placeholder — see content/gabriel.ts — pending his voice
 * memos. This is the primary page for the Person schema — every other
 * page's byline links back here.
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
  const trail: Crumb[] = [{ href: `/${locale}/about/`, label: dict.nav.about }]

  return (
    <>
      <JsonLd data={[buildBreadcrumbSchema(locale, dict, trail), buildPersonSchema(locale)]} />
      <Breadcrumb locale={locale} dict={dict} trail={trail} />

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
