'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import type { Dictionary } from '@/types'

type NavLink = { href: string; label: string }

// No-op subscription: this never changes after the initial render, so it
// exists purely to get a client/server-aware snapshot without setState-in-
// an-effect (the react-hooks/set-state-in-effect rule flags that pattern) —
// this is React's own documented way to know "are we past hydration yet".
const noopSubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

/**
 * The only stateful component on the site. Everything else is static HTML.
 */
export function MobileMenu({ links, dict }: { links: NavLink[]; dict: Dictionary }) {
  const [open, setOpen] = useState(false)
  // The overlay is portalled to <body> (below) rather than left in place —
  // <header> carries backdrop-blur-xl, and backdrop-filter makes an element
  // a containing block for its `fixed` descendants (same rule as
  // `transform`), which silently shrank this panel to the header's own
  // 64px instead of the full viewport. Portalling sidesteps that as soon as
  // it mounts on the client; `mounted` avoids a server/client markup
  // mismatch, since there's nothing to portal during the static export.
  const mounted = useMounted()

  // Stop the page scrolling behind the open menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes it — expected behaviour for any overlay.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.menu}
        aria-expanded={open}
        className="p-2 md:hidden"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            hidden={!open}
            className="fixed inset-0 z-50 flex flex-col bg-sand p-6 md:hidden"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.nav.close}
                className="p-2"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-sand-deep py-4 font-display text-2xl"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </>
  )
}
