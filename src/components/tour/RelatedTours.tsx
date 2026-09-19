import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { TourCard } from '@/components/tour/TourCard'
import type { Dictionary, Locale } from '@/types'
import type { Tour } from '@/types/tour'

export function RelatedTours({
  tours,
  locale,
  dict,
}: {
  tours: Tour[]
  locale: Locale
  dict: Dictionary
}) {
  if (tours.length === 0) return null

  return (
    <Section tone="sandDeep">
      <Container>
        <h2 className="text-2xl sm:text-3xl">{dict.tours.relatedTitle}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} locale={locale} dict={dict} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
