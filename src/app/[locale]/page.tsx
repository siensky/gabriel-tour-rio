import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AboutGabriel } from '@/components/sections/AboutGabriel'
import { CategoryFilter } from '@/components/tour/CategoryFilter'
import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { Section } from '@/components/ui/Section'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { business } from '@/content/business'
import { tours } from '@/content/tours'
import { getDictionary, isLocale, localeParams } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import type { TourCategory } from '@/types/tour'

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
    path: '',
    title: dict.meta.home.title,
    description: dict.meta.home.description,
  })
}

/** Same order as the plan's tour clusters. */
const CATEGORY_ORDER: TourCategory[] = [
  'city',
  'favela',
  'hiking',
  'beach',
  'water',
  'nightlife',
  'transfer',
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)

  // Hubs (favela-tours, hiking-rio-de-janeiro) are excluded here — they're
  // themselves a directory of the other cards already shown, so a card
  // linking to "more like these ones" among its own children is redundant.
  const bookable = tours.filter((tour) => !tour.hub).sort((a, b) => a.order - b.order)
  const presentCategories = CATEGORY_ORDER.filter((category) =>
    bookable.some((tour) => tour.category === category),
  )

  return (
    <>
      {/* HERO — full-bleed. */}
      <section className="relative flex h-[85vh] min-h-[520px] w-full items-end overflow-hidden sm:h-[640px]">
        <Picture
          src="rio-sunset-hero"
          alt={dict.home.heroImageAlt}
          className="absolute inset-0 h-full w-full"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/5" />
        <Container className="relative z-10 pb-10 sm:pb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
            {business.areaServed}
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{dict.home.heroSubtitle}</p>
          <div className="mt-8">
            <WhatsAppButton
              variant="hero"
              label={dict.cta.bookOnWhatsapp}
              message={dict.whatsapp.general}
            />
          </div>
        </Container>
      </section>

      {/* MEET GABRIEL — directly under the hero, before the tour listing.
          The differentiator should be the second thing a visitor sees, not
          something they find after scrolling past the products first. */}
      <AboutGabriel locale={locale} dict={dict} variant="full" />

      {/* TOURS — category buttons filter a shared grid; 24 tours is too many
          to show all at once, and this is the same interaction the /tours
          hall already uses (see CategoryFilter), reused rather than
          duplicated. Every category is a tappable chip, so a visitor
          narrows straight to "Beach" or "Favela" in one tap instead of
          scrolling past everything else — matters most on mobile, where
          most visitors are. */}
      <Section tone="sandDeep" id="tours">
        <Container>
          <h2 className="text-3xl sm:text-4xl">{dict.home.toursTitle}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{dict.home.toursSubtitle}</p>

          <div className="mt-10">
            <CategoryFilter
              tours={bookable}
              categories={presentCategories}
              locale={locale}
              dict={dict}
              headingLevel="h3"
            />
          </div>
        </Container>
      </Section>

      {/* CUSTOM TOURS — a fallback CTA for anyone who didn't find what they
          wanted in the grid above; reuses the same WhatsApp mechanism as
          every other CTA on the site, just with its own pre-filled message
          so Gabriel can tell it apart from a specific-tour enquiry. */}
      <Section tone="sand" id="custom-tours">
        <Container>
          <div className="rounded-card bg-gradient-to-br from-badge-gold to-sunset-vivid px-6 py-14 text-center sm:px-16 sm:py-20">
            {/* Solid ink, no opacity — the gradient's darker (sunset-vivid)
                end only clears 4.5:1 with ink at full strength (5.19:1); a
                lighter tint fails right where the gradient is at its
                darkest. */}
            <span className="text-xs font-semibold uppercase tracking-wider text-ink">
              {dict.home.customToursEyebrow}
            </span>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {dict.home.customToursTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink">{dict.home.customToursSubtitle}</p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton
                variant="banner"
                label={dict.home.customToursCta}
                message={dict.whatsapp.customTour}
              />
            </div>
          </div>
        </Container>
      </Section>

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
