import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-sunset text-white hover:bg-sunset-dark',
  secondary: 'bg-ocean text-white hover:bg-ocean-dark',
  ghost: 'border border-current text-ink hover:bg-ink hover:text-sand',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-card font-semibold transition-colors duration-150'

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  external = false,
  className,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  external?: boolean
  className?: string
}) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
