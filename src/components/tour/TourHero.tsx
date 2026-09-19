import { Container } from '@/components/ui/Container'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import type { Dictionary } from '@/types'
import type { Tour, TourCopy } from '@/types/tour'

export function TourHero({
  tour,
  copy,
  dict,
}: {
  tour: Tour
  copy: TourCopy
  dict: Dictionary
}) {
  return (
    <div>
      <PlaceholderImage label={copy.title} className="aspect-[16/9] w-full sm:aspect-[21/9]" />

      <Container>
        <div className="max-w-3xl py-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-ocean">
            {dict.categories[tour.category]}
          </span>

          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl">{copy.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{copy.tagline}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-ink-soft">{dict.tours.duration}</dt>
              <dd className="font-semibold">
                {tour.durationHours !== null
                  ? `${tour.durationHours} ${dict.tours.hours}`
                  : dict.tours.priceOnRequest}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">{dict.tours.groupSize}</dt>
              <dd className="font-semibold">
                {tour.groupSizeMax !== null
                  ? `${dict.tours.upTo} ${tour.groupSizeMax} ${dict.tours.people}`
                  : dict.tours.priceOnRequest}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">{dict.tours.from}</dt>
              <dd className="font-semibold">
                {tour.priceFromBRL !== null ? `R$ ${tour.priceFromBRL}` : dict.tours.priceOnRequest}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <WhatsAppButton variant="hero" label={dict.cta.bookThisTour} message={copy.whatsappMessage} />
          </div>
        </div>
      </Container>
    </div>
  )
}
