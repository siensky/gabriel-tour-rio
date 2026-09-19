import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { WaveDivider } from '@/components/ui/WaveDivider'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'

export function generateStaticParams() {
  return localeParams()
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)

  return (
    <>
      {/* HERO — a real photo of Gabriel in Rio goes behind this in phase 5. */}
      <Section tone="sand" className="pt-12 sm:pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">{dict.home.heroSubtitle}</p>
            <div className="mt-8">
              <WhatsAppButton
                variant="hero"
                label={dict.cta.bookOnWhatsapp}
                message={dict.whatsapp.general}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WaveDivider className="text-ocean" />

      {/* TOURS — category bands are built in phase 2, once tours.ts exists. */}
      <Section tone="sandDeep" id="tours">
        <Container>
          <h2 className="text-3xl sm:text-4xl">{dict.home.toursTitle}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{dict.home.toursSubtitle}</p>
        </Container>
      </Section>

      {/* MEET GABRIEL — built in phase 3, from his own voice memos. */}

      <Section tone="sand">
        <Container>
          <h2 className="text-3xl sm:text-4xl">{dict.home.howItWorksTitle}</h2>

          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { title: dict.howItWorks.step1Title, body: dict.howItWorks.step1Body },
              { title: dict.howItWorks.step2Title, body: dict.howItWorks.step2Body },
              { title: dict.howItWorks.step3Title, body: dict.howItWorks.step3Body },
            ].map((step, index) => (
              <li key={step.title}>
                <span className="font-display text-5xl text-sunset">{index + 1}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  )
}
