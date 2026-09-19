import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Tone = 'sand' | 'sandDeep' | 'forest'

const tones: Record<Tone, string> = {
  sand: 'bg-sand text-ink',
  sandDeep: 'bg-sand-deep text-ink',
  forest: 'bg-forest text-sand',
}

/**
 * Vertical rhythm in one place, so spacing stays consistent without repeating
 * the same Tailwind classes on every section.
 */
export function Section({
  children,
  tone = 'sand',
  className,
  id,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('py-16 sm:py-24', tones[tone], className)}>
      {children}
    </section>
  )
}
