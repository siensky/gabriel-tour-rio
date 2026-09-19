import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/types'
import type { TourCopy } from '@/types/tour'

/**
 * Plain HTML details/summary — no client JS needed for an accordion, and the
 * FAQPage JSON-LD schema (Fas 4) is built from this same `copy.faq` array.
 */
export function TourFaq({ copy, dict }: { copy: TourCopy; dict: Dictionary }) {
  if (copy.faq.length === 0) return null

  return (
    <Section tone="sand">
      <Container>
        <h2 className="text-2xl sm:text-3xl">{dict.tours.faqTitle}</h2>
        <div className="mt-6 max-w-3xl divide-y divide-sand-deep border-y border-sand-deep">
          {copy.faq.map((item, index) => (
            <details key={index} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                {item.question}
              </summary>
              <p className="mt-2 text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  )
}
