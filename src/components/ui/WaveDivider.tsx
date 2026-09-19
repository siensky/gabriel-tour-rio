/**
 * The Copacabana calçadão wave — Rio's pavement mosaic, drawn as a repeating
 * SVG. It is the site's signature detail: instantly Rio, and nobody else uses
 * it. Decorative only, so it is hidden from assistive technology.
 */
export function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`overflow-hidden leading-none ${className}`}>
      <svg
        className="h-6 w-full"
        viewBox="0 0 120 24"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="calcadao" width="40" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M0 12 C 10 0, 30 0, 40 12 C 30 24, 10 24, 0 12 Z"
              fill="currentColor"
              opacity="0.18"
            />
          </pattern>
        </defs>
        <rect width="120" height="24" fill="url(#calcadao)" />
      </svg>
    </div>
  )
}
