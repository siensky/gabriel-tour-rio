import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'

export function generateStaticParams() {
  return localeParams()
}

/**
 * Structural placeholder only. The real page — Gabriel's story in his own
 * voice, the <AboutGabriel> component, the Person schema — is Fas 3 ("sajtens
 * premiss, inte en detalj att klämma in sist"), built from his voice memos.
 * This route exists now so /about/ resolves and the site's URL count is
 * complete for the Fas 2 build check.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)

  return (
    <Section tone="sand" className="pt-10">
      <Container>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl">{dict.nav.about}</h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          TODO ({locale}): Gabriel&apos;s story, in his own words — built in Fas 3 from his
          voice memos. See the plan&apos;s &quot;Gabriels positionering&quot;.
        </p>
      </Container>
    </Section>
  )
}
