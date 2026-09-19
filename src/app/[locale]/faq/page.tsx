import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'

export function generateStaticParams() {
  return localeParams()
}

/**
 * Site-wide FAQ (booking, languages, safety in general) — distinct from the
 * per-tour FAQ blocks in TourFaq. Real questions and answers are TODO,
 * pending Gabriel's input; the FAQPage schema is added in Fas 4.
 */
const PLACEHOLDER_COUNT = 6

export default async function FaqPage({
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl">{dict.nav.faq}</h1>

        <div className="mt-8 max-w-3xl divide-y divide-sand-deep border-y border-sand-deep">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <details key={index} className="py-4">
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                {`TODO (${locale}): FAQ question ${index + 1}`}
              </summary>
              <p className="mt-2 text-ink-soft">{`TODO (${locale}): FAQ answer ${index + 1}`}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  )
}
