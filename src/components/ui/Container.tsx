import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Horizontal gutter + max width. Every section's content sits inside one. */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
  )
}
