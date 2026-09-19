import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/types'
import type { TourCopy } from '@/types/tour'

export function TourHighlights({ copy, dict }: { copy: TourCopy; dict: Dictionary }) {
  return (
    <Section tone="sandDeep">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {copy.body.map((paragraph, index) => (
              <p key={index} className="mb-4 text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">{dict.tours.highlights}</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {copy.highlights.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span aria-hidden="true" className="text-sunset">
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">{dict.tours.included}</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {copy.included.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span aria-hidden="true" className="text-ocean">
                      &check;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {copy.notIncluded.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold">{dict.tours.notIncluded}</h2>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {copy.notIncluded.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span aria-hidden="true" className="text-ink-soft">
                        &times;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
